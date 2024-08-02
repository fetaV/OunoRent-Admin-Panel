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
import API_BASE_URL from '../../../../config'

const Footer = () => {
  const [footer, setFooter] = useState([])
  const [currentFooter, setCurrentFooter] = useState(null)
  const [newFooter, setNewFooter] = useState({
    label: '',
    targetUrl: '',
    orderNumber: 0,
    onlyToMembers: false,
    isActive: false,
  })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetchfooter()
  }, [])

  const fetchfooter = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/footerItem`)
      console.log('getfooter response:', response.data)
      setFooter(response.data)
    } catch (error) {
      console.error('getfooter error:', error)
      toast.error('Failed to fetch menu items')
    }
  }

  const handleCreateFooter = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/footerItem`, newFooter)
      console.log('createFooter response:', response.data)
      toast.success('Menu item created successfully')
      fetchfooter()
      setVisible(false)
    } catch (error) {
      console.error('createFooter error:', error)
      toast.error('Failed to create menu item')
    }
  }

  const handleUpdateFooter = async (FooterId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/footerItem/${FooterId}`, currentFooter)
      console.log('updateFooter response:', response.data)
      toast.success('Menu item updated successfully')
      fetchfooter()
      setVisible(false)
    } catch (error) {
      console.error('updateFooter error:', error)
      toast.error('Failed to update menu item')
    }
  }

  const handleDeleteFooter = async (FooterId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/footerItem/${FooterId}`)
      console.log('deleteFooter response:', response.data)
      toast.success('Menu item deleted successfully')
      fetchfooter()
    } catch (error) {
      console.error('deleteFooter error:', error)
      toast.error('Failed to delete menu item')
    }
  }

  return (
    <div>
      <ToastContainer />
      <CButton color="primary" className="mb-3" onClick={() => setVisible(true)}>
        Yeni Footer Ekle
      </CButton>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Menü Başlığı</CTableHeaderCell>
            <CTableHeaderCell scope="col">Sıra Numarası</CTableHeaderCell>
            <CTableHeaderCell scope="col">Sütun</CTableHeaderCell>
            <CTableHeaderCell scope="col">Hedef URL</CTableHeaderCell>
            <CTableHeaderCell scope="col">Durum</CTableHeaderCell>
            <CTableHeaderCell scope="col">Eylemler</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {footer.map((item) => (
            <CTableRow key={item.footerItemId}>
              <CTableDataCell>{item.label}</CTableDataCell>
              <CTableDataCell>{item.orderNumber}</CTableDataCell>
              <CTableDataCell>{item.column}</CTableDataCell>
              <CTableDataCell>{item.targetUrl}</CTableDataCell>
              <CTableDataCell>{item.isActive ? 'Aktif' : 'Pasif'}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => {
                    setCurrentFooter(item)
                    setVisible(true)
                  }}
                >
                  Düzenle
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDeleteFooter(item.footerItemId)}
                >
                  Sil
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{currentFooter ? 'Edit Menu Item' : 'Create Menu Item'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              className="mb-3"
              placeholder="Label"
              label="Menü Başlığı"
              value={currentFooter ? currentFooter.label : newFooter.label}
              onChange={(e) =>
                currentFooter
                  ? setCurrentFooter({ ...currentFooter, label: e.target.value })
                  : setNewFooter({ ...newFooter, label: e.target.value })
              }
            />
            <CFormInput
              type="text"
              className="mb-3"
              placeholder="Target URL"
              label="Hedef URL"
              value={currentFooter ? currentFooter.targetUrl : newFooter.targetUrl}
              onChange={(e) =>
                currentFooter
                  ? setCurrentFooter({ ...currentFooter, targetUrl: e.target.value })
                  : setNewFooter({ ...newFooter, targetUrl: e.target.value })
              }
            />
            <CFormInput
              type="number"
              className="mb-3"
              placeholder="Order Number"
              label="Sıra Numarası"
              value={currentFooter ? currentFooter.orderNumber : newFooter.orderNumber}
              onChange={(e) =>
                currentFooter
                  ? setCurrentFooter({ ...currentFooter, orderNumber: +e.target.value })
                  : setNewFooter({ ...newFooter, orderNumber: +e.target.value })
              }
            />

            <CFormSwitch
              label="Durum"
              checked={currentFooter ? currentFooter.isActive : newFooter.isActive}
              onChange={(e) =>
                currentFooter
                  ? setCurrentFooter({ ...currentFooter, isActive: e.target.checked })
                  : setNewFooter({ ...newFooter, isActive: e.target.checked })
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
              currentFooter ? handleUpdateFooter(currentFooter.footerItemId) : handleCreateFooter()
            }
          >
            {currentFooter ? 'Save Changes' : 'Create'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Footer
