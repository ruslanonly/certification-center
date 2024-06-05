import { Tile } from "@/shared";
import { Button, Stack, Typography } from "@mui/material";

export function Reciever() {
  return (
    <Tile>
        <Typography variant="h5" style={{textAlign: 'center'}}>
        Получатель
        </Typography>
        {!!'wComma' && <Typography sx={{wordBreak: 'break-all'}}>Число W' = {'wComma'?.toString()}</Typography>}
        <Stack gap={1} sx={{marginTop: '1rem'}}>
            <Button variant="contained" >Проверка</Button>
        </Stack>
    </Tile>
  )
}
