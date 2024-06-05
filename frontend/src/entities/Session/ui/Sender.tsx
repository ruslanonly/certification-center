import { Tile } from "@/shared";
import { ax } from "@/shared/lib/axios";
import { IRegisterData, useCertificationStore } from "@/shared/model/store/standart";
import { ValueCell } from "@/shared/ui/components/ValueCell/Tile";
import { Button, FormControl, LinearProgress, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

export function Sender() {
    const [isRegistering, setIsRegistering] = useState(false)
    const { PEER_ID, public_keys, private_keys, pChecks, qChecks, certificate_sign, setAttr } = useCertificationStore()
    
    useEffect(() => {
        const registerInCenter = async () => {
            setIsRegistering(true)
            const { data: registerData } = await ax.get<IRegisterData>(`/registerInCenter/Первый сертификационный центр`).finally(() => setIsRegistering(false))

            console.log(registerData)

            setAttr('public_keys', registerData.public_keys)
            setAttr('private_keys', registerData.private_keys)
            setAttr('pChecks', registerData.pChecks)
            setAttr('qChecks', registerData.qChecks)

            setAttr('certificate_sign', registerData.certificate_sign)

        }

        registerInCenter()
    }, [])

    const sendMessage = async () => {
        const { data: registerData } = await ax.get<IRegisterData>(`/registerInCenter/Первый сертификационный центр`).finally(() => setIsRegistering(false))
    }

    console.log(public_keys)

    return (
        <Tile>
            <Stack gap={2}>
                <Typography variant="h5" style={{textAlign: 'center'}}>
                Отправитель
                </Typography>
                    {isRegistering ? <LinearProgress/> : (
                        <Stack direction="column" gap={2} alignItems='stretch'>
                            <Stack direction="column" gap={2} margin='10px 0'>
                                <Typography variant="h6">Ваш публичный ключ</Typography>
                                <ValueCell name="P" value={public_keys?.p}/>
                                <TextField label="Проверка P" disabled multiline maxRows={3} variant="outlined" value={pChecks?.join('')}/>
                                <ValueCell name="Q" value={public_keys?.q}/>
                                <TextField label="Проверка Q" disabled multiline maxRows={3}  variant="outlined" value={qChecks?.join('')}/>
                                <ValueCell name="Y" value={public_keys?.y}/>
                            </Stack>

                            <Stack gap={1} sx={{marginTop: '1rem'}}>
                                <Button variant="contained">Отправить публичный ключ собеседнику</Button>
                            </Stack>

                            <Stack direction="column" gap={2} margin='10px 0'>
                                <Typography variant="h6">Ваш приватный ключ</Typography>
                                <ValueCell name="X" value={private_keys?.x}/>
                            </Stack>

                            <Stack direction="column" gap={2} margin='10px 0'>
                                <Typography variant="h6">Введите сообщение</Typography>
                                
                                <FormControl sx={{gap: 1}} size="small">
                                    <TextField
                                    label="Сообщение"
                                    variant="outlined"
                                    size="small"
                                    value={'message' || ''}/>
                                </FormControl>
                                <ValueCell name="H" value={certificate_sign?.h}/>
                                <ValueCell name="W'" value={certificate_sign?.w2}/>
                                <ValueCell name="S" value={certificate_sign?.s}/>
                            </Stack>
                            
                            
                        </Stack>
                    )}
            </Stack>
        </Tile>
    )
}
