import { RegisterUser } from "@/features/RegisterUser";
import { Page } from "@/shared";
import { Stack } from "@mui/material";

export default function MainPage() {
  return (
    <Page>
      <Stack spacing={2}>
          <RegisterUser/>
      </Stack>
    </Page>
  )
}
