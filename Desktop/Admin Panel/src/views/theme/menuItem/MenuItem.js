import React, { useState, useEffect } from 'react'
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormSwitch,
} from '@coreui/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([])
  const [activeMenuItems, setActiveMenuItems] = useState([])
  const [currentMenuItem, setCurrentMenuItem] = useState(null)
  const [newMenuItem, setNewMenuItem] = useState({
    label: '',
    targetUrl: '',
    orderNumber: 0,
    onlyToMembers: false,
    isActive: false,
  })
  const [visible, setVisible] = useState(false)

  const API_BASE_URL = 'http://10.10.3.181:5244/api/MenuItem'

  useEffect(() => {
    fetchMenuItems()
    fetchActiveMenuItems()
  }, [])

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(API_BASE_URL)
      console.log('getMenuItems response:', response.data)
      setMenuItems(response.data)
    } catch (error) {
      console.error('getMenuItems error:', error)
      toast.error('Failed to fetch menu items')
    }
  }

  const fetchActiveMenuItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/GetActive`)
      console.log('getActiveMenuItems response:', response.data)
      setActiveMenuItems(response.data)
    } catch (error) {
      console.error('getActiveMenuItems error:', error)
      toast.error('Failed to fetch active menu items')
    }
  }

  const handleCreateMenuItem = async () => {
    try {
      const response = await axios.post(API_BASE_URL, newMenuItem)
      console.log('createMenuItem response:', response.data)
      toast.success('Menu item created successfully')
      fetchMenuItems()
      setVisible(false)
    } catch (error) {
      console.error('createMenuItem error:', error)
      toast.error('Failed to create menu item')
    }
  }

  const handleUpdateMenuItem = async (menuItemId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${menuItemId}`, currentMenuItem)
      console.log('updateMenuItem response:', response.data)
      toast.success('Menu item updated successfully')
      fetchMenuItems()
      setVisible(false)
    } catch (error) {
      console.error('updateMenuItem error:', error)
      toast.error('Failed to update menu item')
    }
  }

  const handleDeleteMenuItem = async (menuItemId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${menuItemId}`)
      console.log('deleteMenuItem response:', response.data)
      toast.success('Menu item deleted successfully')
      fetchMenuItems()
    } catch (error) {
      console.error('deleteMenuItem error:', error)
      toast.error('Failed to delete menu item')
    }
  }

  return (
    <div>
      <ToastContainer />
      <CButton color="primary" className="mb-3" onClick={() => setVisible(true)}>
        Yeni Menü Ekle
      </CButton>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Menü Başlığı</CTableHeaderCell>
            <CTableHeaderCell scope="col">Sıra Numarası</CTableHeaderCell>
            <CTableHeaderCell scope="col">Hedef URL</CTableHeaderCell>
            <CTableHeaderCell scope="col">Aktiflik</CTableHeaderCell>
            <CTableHeaderCell scope="col">Kullanıcılara Özel</CTableHeaderCell>
            <CTableHeaderCell scope="col">Eylemler</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {menuItems.map((item) => (
            <CTableRow key={item.menuItemId}>
              <CTableDataCell>{item.label}</CTableDataCell>
              <CTableDataCell>{item.orderNumber}</CTableDataCell>
              <CTableDataCell>{item.targetUrl}</CTableDataCell>
              <CTableDataCell>{item.isActive ? 'Evet' : 'Hayır'}</CTableDataCell>
              <CTableDataCell>{item.onlyToMembers ? 'Evet' : 'Hayır'}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => {
                    setCurrentMenuItem(item)
                    setVisible(true)
                  }}
                >
                  Edit
                </CButton>
                <CButton color="danger" onClick={() => handleDeleteMenuItem(item.menuItemId)}>
                  Delete
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{currentMenuItem ? 'Edit Menu Item' : 'Create Menu Item'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              className="mb-3"
              placeholder="Label"
              label="Menü Başlığı"
              value={currentMenuItem ? currentMenuItem.label : newMenuItem.label}
              onChange={(e) =>
                currentMenuItem
                  ? setCurrentMenuItem({ ...currentMenuItem, label: e.target.value })
                  : setNewMenuItem({ ...newMenuItem, label: e.target.value })
              }
            />
            <CFormInput
              type="text"
              className="mb-3"
              placeholder="Target URL"
              label="Hedef URL"
              value={currentMenuItem ? currentMenuItem.targetUrl : newMenuItem.targetUrl}
              onChange={(e) =>
                currentMenuItem
                  ? setCurrentMenuItem({ ...currentMenuItem, targetUrl: e.target.value })
                  : setNewMenuItem({ ...newMenuItem, targetUrl: e.target.value })
              }
            />
            <CFormInput
              type="number"
              className="mb-3"
              placeholder="Order Number"
              label="Sıra Numarası"
              value={currentMenuItem ? currentMenuItem.orderNumber : newMenuItem.orderNumber}
              onChange={(e) =>
                currentMenuItem
                  ? setCurrentMenuItem({ ...currentMenuItem, orderNumber: +e.target.value })
                  : setNewMenuItem({ ...newMenuItem, orderNumber: +e.target.value })
              }
            />
            <CFormSwitch
              label="Kullanıcılara Özel"
              checked={currentMenuItem ? currentMenuItem.onlyToMembers : newMenuItem.onlyToMembers}
              onChange={(e) =>
                currentMenuItem
                  ? setCurrentMenuItem({ ...currentMenuItem, onlyToMembers: e.target.checked })
                  : setNewMenuItem({ ...newMenuItem, onlyToMembers: e.target.checked })
              }
            />
            <CFormSwitch
              label="Aktiflik"
              checked={currentMenuItem ? currentMenuItem.isActive : newMenuItem.isActive}
              onChange={(e) =>
                currentMenuItem
                  ? setCurrentMenuItem({ ...currentMenuItem, isActive: e.target.checked })
                  : setNewMenuItem({ ...newMenuItem, isActive: e.target.checked })
              }
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton
            color="primary"
            onClick={() =>
              currentMenuItem
                ? handleUpdateMenuItem(currentMenuItem.menuItemId)
                : handleCreateMenuItem()
            }
          >
            {currentMenuItem ? 'Save Changes' : 'Create'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default MenuItems
