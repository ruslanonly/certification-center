import { Reciever, Sender } from "@/entities/Session";
import { BASE_URL } from "@/shared/lib/axios";
import { useCertificationStore } from "@/shared/model/store/standart";
import { Grid, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

enum EMessageType {
  CURRENT_CONNECTIONS = 'CURRENT_CONNECTIONS'
}

export function Session() {
  const socket = useRef<WebSocket>()
  const { CLIENT_ID, PEER_ID, setAttr } = useCertificationStore()

  const [isConnecting, setIsConnecting] = useState(false)


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
        const message = JSON.parse(e.data)

        if (message.type === EMessageType.CURRENT_CONNECTIONS) {
            const connections = message.currentConnections as string[]

            const peer_id = connections.find((cid) => cid !== CLIENT_ID)

            if (peer_id) {
              setAttr('PEER_ID', peer_id)
              setIsConnecting(false)
            }
        }
      } catch (error) {
        console.log('JSON PARSE MESSAGE BODY ERROR', error)
      }
    }
  }, [])

  console.log('SESSION', CLIENT_ID, '<-->', PEER_ID)

  return (
    <Stack gap={5}>
      <Stack direction="column" gap={10}>
        <Stack direction="column" gap={1} alignItems='center'>
          <Typography variant="h4">Обмен сообщениями с подписью по ГОСТ Р 34.10-94</Typography>
          <Typography>Ваш идентификатор {CLIENT_ID}</Typography>
          {PEER_ID && <Typography><Typography component='span' color='green'>Подключение установлено с </Typography>{PEER_ID}</Typography>}
        </Stack>
        {!isConnecting && (
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
