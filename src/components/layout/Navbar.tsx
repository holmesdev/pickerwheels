import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { useState } from 'react'

export default function Navbar({ loggedIn, onLogOut }: { loggedIn: boolean; onLogOut: () => Promise<void> }) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const pages: { title: string; url?: string; action?: () => Promise<void> }[] = loggedIn
    ? [
        {
          title: 'Log Out',
          action: onLogOut,
        },
      ]
    : [
        { title: 'Register', url: '/register' },
        { title: 'Login', url: '/login' },
      ]

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Link href="/" sx={{ color: 'inherit', flexGrow: 1 }} underline="none">
            <Typography variant="h6">Picker Wheels</Typography>
          </Link>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => {
              return page.url ? (
                <Link sx={{ my: 2, mx: 1, display: 'block' }} key={page.title} href={page.url} underline="none">
                  {page.title}
                </Link>
              ) : (
                <Link
                  key={page.title}
                  component="button"
                  onClick={() => {
                    page.action ? page.action() : null
                  }}
                  underline="none"
                >
                  {page.title}
                </Link>
              )
            })}
          </Box>
        </Toolbar>
      </AppBar>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {pages.map((page) => (
          <MenuItem key={page.title}>
            {page.url && (
              <Link key={page.title} href={page.url} underline="none">
                <Typography variant="button">{page.title}</Typography>
              </Link>
            )}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}
