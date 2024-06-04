import { Tile } from "@/shared";
import { useCertificationStore } from "@/shared/model/store/standart";
import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

export function RegisterUser() {
    const [isRegistering, setIsRegistering] = useState(false)
    const { public_keys, private_keys, certificate, certificate_sign, setAttr } = useCertificationStore()

    const registerUser = async () => {
        setIsRegistering(true)
        await fetch('http://localhost:8000/registerUser').then(async (response) => {
            const body = await response.json()
            setAttr('public_keys', body.public_keys)
            setAttr('private_keys', body.private_keys)
            setAttr('certificate', body.certificate)
            setAttr('certificate_sign', body.certificate_sign)
        })
        setIsRegistering(false)

    }

    const sx = {wordBreak: 'break-all'}

    return (
        <Tile>
            <Stack spacing={2}>
                <Typography variant="h5" >
                    Регистрация пользователя удостоверяющего центра
                </Typography>
                <Button
                    disabled={isRegistering}
                    sx={{whiteSpace: 'nowrap'}}
                    variant="contained"
                    onClick={registerUser}>
                        {isRegistering ? 'Выполняется запрос' : 'Регистрация'}
                </Button>
                {public_keys && (
                    <Typography variant="body1" sx={sx}>
                        Публичные ключи {JSON.stringify(public_keys)}
                    </Typography>
                )}
                {private_keys && (
                    <Typography variant="body1" sx={sx}>
                        Приватные ключи {JSON.stringify(private_keys)}
                    </Typography>
                )}
                {certificate_sign && (
                    <Typography variant="body1" sx={sx}>
                        Подпись сертификат {JSON.stringify(certificate_sign)}
                    </Typography>
                )}
                {certificate_sign && (
                    <Typography variant="body1" sx={sx}>
                        Сертификат {JSON.stringify(certificate)}
                    </Typography>
                )}
            </Stack>
        </Tile>
    )
}
