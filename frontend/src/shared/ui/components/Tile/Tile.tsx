import { Paper } from "@mui/material";

interface ITileProps extends React.PropsWithChildren {
  disabled?: boolean
}

export function Tile({ children, disabled }: ITileProps) {
  const sx: React.CSSProperties = disabled === true ? {
    opacity: 0.2,
    pointerEvents: 'none'
  } : {}
  return (
    <Paper style={{
        padding: '1rem',
        borderRadius: '1rem',
        transition: 'opacity .5s ease',
        ...sx
      }}>
      {children}
    </Paper>
  )
}
