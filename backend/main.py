from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from GOST94 import ESignature
from pydantic import BaseModel
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CertificationCenter:
    def __init__(self,name):
        self.name = name
        self.signature = ESignature()
        self.signature.generate_keys()
        self.parent_certificates = []

    def register_from_center(self, parentCenter):
        registration_data = parentCenter.register_user()
        self.signature = ESignature(registration_data["public_keys"]["p"], registration_data["public_keys"]["q"],
                                    registration_data["public_keys"]["a"], registration_data["private_keys"]["x"],
                                    registration_data["public_keys"]["y"])
        self.parent_certificates.append({
            "name": parentCenter.name,
            "certification_center_public_key": registration_data["certificate"]["certification_center_public_key"],
            "certificate_signature": registration_data["certificate_sign"],
            "public_key": self.signature.get_public_keys_object()
        })
        if registration_data["parent_certificates"]:
            self.parent_certificates.extend(registration_data["parent_certificates"])

    def register_user(self):
        user_keys = ESignature()
        user_keys.generate_keys()

        user_keys.is_prime(user_keys.p)
        pChecks = user_keys.checks

        user_keys.is_prime(user_keys.q)
        qChecks = user_keys.checks

        certificate_data = {
            "certification_center_public_key": self.signature.get_public_keys_object(),
            "user_public_key": user_keys.get_public_keys_object(),
        }

        certificate_data_string = json.dumps(certificate_data).replace(" ", "")
        certificate_sign = self.signature.sign_message(certificate_data_string)

        return {
            "certificate": certificate_data,
            "certificate_sign": {
                "h": str(certificate_sign[0]),
                "w2": str(certificate_sign[1]),
                "s": str(certificate_sign[2])
            },
            "parent_certificates": self.parent_certificates,
            "public_keys": user_keys.get_public_keys_object(),
            "private_keys": user_keys.get_private_keys_object(),
            "pChecks": pChecks,
            "qChecks": qChecks
        }


class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, conn_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[conn_id] = websocket

    def disconnect(self, conn_id: str):
        self.active_connections.pop(conn_id)

    async def send_personal_message(self, message, conn_id: str):
        await self.active_connections[conn_id].send_json(message)

    async def broadcast(self, message):
        for connection in self.active_connections.values():
            try:
                await connection.send_json(message)
            except Exception:
                print("Error broadcasting")


manager = ConnectionManager()
certificationCenters = {}

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(client_id, websocket)

    await manager.broadcast({
        "type": "CURRENT_CONNECTIONS",
        "currentConnections": list(manager.active_connections.keys())
    })

    try:
        while True:
            data = await websocket.receive_json()
            if "toId" in data.keys():
                await manager.send_personal_message(data["message"], data["toId"])
    except WebSocketDisconnect:
        manager.disconnect(client_id)
        await manager.broadcast({
            "type": "CLIENT_DISCONNECTED",
            "fromId": client_id
        })

@app.get("/hello")
async def hello():
    return {
        "hello": "hello"
    }

@app.get("/initializeCenters")
async def initialize_centers():
    certificationCenter1 = CertificationCenter("Первый сертификационный центр")
    certificationCenters["Первый сертификационный центр"] = certificationCenter1

    certificationCenter2 = CertificationCenter("Второй сертификационный центр")
    certificationCenters["Второй сертификационный центр"] = certificationCenter2

    certificationCenter3 = CertificationCenter("Третий сертификационный центр")
    certificationCenters["Третий сертификационный центр"] = certificationCenter3

    certificationCenter4 = CertificationCenter("Четвертый сертификационный центр")
    certificationCenters["Четвертый сертификационный центр"] = certificationCenter4

    certificationCenter2.register_from_center(certificationCenter1)
    certificationCenter3.register_from_center(certificationCenter1)

    return {
        "message": "OK"
    }

@app.get("/getCertificationCenters")
async def get_certification_centers():
    return list(certificationCenters.keys())

@app.get("/registerInCenter/{center_id}")
async def register_in_center(center_id: str):
    if center_id not in certificationCenters.keys():
        return {
            "message": "Wrong center id"
        }

    return certificationCenters[center_id].register_user()

@app.get("/createKeyPair")
async def create_key_pair():
    sig = ESignature()

    sig.is_prime(sig.p)
    pChecks = sig.checks

    sig.is_prime(sig.q)
    qChecks = sig.checks

    return {
        "q": str(sig.q),
        "p": str(sig.p),
        "a": str(sig.a),
        "x": str(sig.x),
        "y": str(sig.y),
        "pChecks": "".join(pChecks),
        "qChecks": "".join(qChecks)
    }


@app.post("/signMessage")
async def sign_message(data=Body()):
    p = int(data["p"])
    q = int(data["q"])
    a = int(data["a"])
    x = int(data["x"])
    y = int(data["y"])
    message = data["message"]
    sig = ESignature(p, q, a, x, y)
    h, w2, s = sig.sign_message(message)

    return {
        "w2": str(w2),
        "s": str(s),
        "h": str(h)
    }


@app.post("/verifySignature")
async def verify_signature(data=Body()):
    p = int(data["p"])
    q = int(data["q"])
    a = int(data["a"])
    y = int(data["y"])
    w2 = int(data["w2"])
    s = int(data["s"])
    message = data["message"]
    h, is_correct = ESignature.verify_signature(message, w2, s, p, q, a, y)
    return {
        "isCorrect": is_correct,
        "h": str(h)
    }
