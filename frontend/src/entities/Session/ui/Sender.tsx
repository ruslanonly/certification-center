import { Tile } from "@/shared";
import { ValueCell } from "@/shared/ui/components/ValueCell/Tile";
import { Button, FormControl, Stack, Step, StepContent, StepLabel, Stepper, TextField, Typography } from "@mui/material";

export function Sender() {
    const activeStep  = 0

    return (
        <Tile>
            <Stack gap={2}>
                <Typography variant="h5" style={{textAlign: 'center'}}>
                Отправитель
                </Typography>
                    <Stack direction="column" gap={2} alignItems='stretch'>
                        <Stack direction="column" gap={2} margin='20px 0'>
                            <ValueCell name="P" value={1231239182234234}/>
                            <ValueCell name="Q" value={1231239182234234}/>
                            <ValueCell name="A" value={1231239182234234}/>
                            <ValueCell name="Y" value={1231239182234234}/>
                        </Stack>
                        <FormControl sx={{gap: 1}} size="small">
                            <TextField
                            label="Сообщение"
                            variant="outlined"
                            size="small"
                            value={'message' || ''}/>
                        </FormControl>
                        {!!'h' && <Typography sx={{wordBreak: 'break-all'}}>Число H = {'h'?.toString()}</Typography>}
                        
                        <Stack gap={1} sx={{marginTop: '1rem'}}>
                            <Button variant="outlined" >Вычисление числа H</Button>
                            <Button variant="contained">Отправить получателю </Button>
                        </Stack>
                    </Stack>
            </Stack>
        </Tile>
    )
}
