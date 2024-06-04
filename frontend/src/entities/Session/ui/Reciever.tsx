import { Tile } from "@/shared";
import { Button, Stack, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";

export function Reciever() {
  const activeStep  = -1

  return (
    <Tile>
        <Typography variant="h5" style={{textAlign: 'center'}}>
        Получатель
        </Typography>
        <Stepper activeStep={activeStep} orientation="vertical">
            <Step>
                <StepLabel>
                    Первый шаг
                </StepLabel>
                <StepContent>
                    {!!'wComma' && <Typography sx={{wordBreak: 'break-all'}}>Число W' = {'wComma'?.toString()}</Typography>}
                    <Stack gap={1} sx={{marginTop: '1rem'}}>
                        <Button variant="contained" >Проверка</Button>
                    </Stack>
                </StepContent>
            </Step>
        </Stepper>
    </Tile>
  )
}
