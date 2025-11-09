import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
  CCloseButton,
  CSidebar,
  // CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CSidebarNav,
  // CNavItem,
  // CNavTitle,
  // CNavGroup,
} from '@coreui/react'
// import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from '../../components/AppSidebarNav'

// import { logo } from 'src/assets/brand/logo'
// import { sygnet } from 'src/assets/brand/sygnet'

import navigation from '../../common/components/_nav'
import authService from 'features/auth/services/authService'

import SimpleBar from 'simplebar-react'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const handleLogout = () => {
    // Call auth service logout
    authService.logout()
    
    // Dispatch logout action
    dispatch({ type: 'LOGOUT' })
    
    // Navigate to login page
    navigate('/login')
  }

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark" // This sets the default color scheme for the sidebar itself
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        {/* <CSidebarBrand to="/"> */}
          {/* Text Logo for Sumarg */}
          <h3 className="sumarg-logo">Sumarg</h3>
        {/* </CSidebarBrand> */}
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} onLogout={handleLogout} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)