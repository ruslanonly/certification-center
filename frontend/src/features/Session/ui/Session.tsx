import { Reciever, Sender } from "@/entities/Session";
import { BASE_URL, ax } from "@/shared/lib/axios";
import { useCertificationStore } from "@/shared/model/store/standart";
import { Grid, LinearProgress, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

enum EMessageType {
  CURRENT_CONNECTIONS = 'CURRENT_CONNECTIONS',
  CLIENT_DISCONNECTED = 'CLIENT_DISCONNECTED'
}

type Message = {
  type: EMessageType.CLIENT_DISCONNECTED;
  fromId: string
} | {
  type: EMessageType.CURRENT_CONNECTIONS;
  currentConnections: string[]
}

const ConnectingProgress = () => {
  return (
    <Stack direction="column" gap={1} alignItems="stretch">
      <Typography textAlign='center'>Поиск собеседника</Typography>
      <LinearProgress />
    </Stack>
  )
}

export function Session() {
  const socket = useRef<WebSocket>()
  const { CLIENT_ID, PEER_ID, setAttr, getValue} = useCertificationStore()

  const [isConnecting, setIsConnecting] = useState(false)

  const initializeCenters = async () => {
      const { data } = await ax.get(`/initializeCenters`)
      const publicKeys = data
      setAttr('public_keys', publicKeys)
  }

  useEffect(() => {
    const CLIENT_ID = Date.now().toString()
    setAttr('CLIENT_ID', CLIENT_ID)

    setIsConnecting(true)
    socket.current = new WebSocket(`${BASE_URL}/ws/${CLIENT_ID}`)

    socket.current.onopen = (e) => {
      console.log('CONNECTED', e)
    }

    socket.current.onmessage = (e) => {
      console.log('MESSAGE', e)

      try {
        const message = JSON.parse(e.data) as Message

        switch(message.type) {
          case EMessageType.CURRENT_CONNECTIONS: {
            const connections = message.currentConnections

            const peer_id = connections.find((cid) => cid !== CLIENT_ID)

            if (peer_id) {
              setAttr('PEER_ID', peer_id)
              setIsConnecting(false)
            }

            break;
          }

          case EMessageType.CLIENT_DISCONNECTED: {
            setIsConnecting(true)

            if (getValue('PEER_ID') === message.fromId) {
              setAttr('PEER_ID', undefined)
            }

            break;
          }
        }
      } catch (error) {
        console.log('JSON PARSE MESSAGE BODY ERROR', error)
      }
    }
  }, [])

  return (
    <Stack gap={5}>
      <Stack direction="column" gap={5}>
        <Stack direction="column" gap={1} alignItems='center'>
          <Typography variant="h4" onClick={initializeCenters}>Обмен сообщениями с подписью по ГОСТ Р 34.10-94</Typography>
          <Typography>Ваш идентификатор {CLIENT_ID}</Typography>
          {PEER_ID && <Typography><Typography component='span' color='green'>Подключение установлено с </Typography>{PEER_ID}</Typography>}
        </Stack>
        {isConnecting ? <ConnectingProgress /> : (
          <Grid container columns={2} spacing={4} flexWrap='nowrap'>
            <Grid item xs>
              <Sender/>
            </Grid>
            <Grid item xs>
              <Reciever/>
            </Grid>
          </Grid>
        )}
        </Stack>
    </Stack>
  )
}
