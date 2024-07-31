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
  CFormTextarea,
} from '@coreui/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from '../../../../config'

const Faq = () => {
  const [faq, setFaq] = useState([])
  const [activeFaq, setActiveFaq] = useState([])
  const [currentMenuItem, setCurrentMenuItem] = useState(null)
  const [newMenuItem, setNewMenuItem] = useState({
    label: '',
    text: '',
    orderNumber: 0,
    isActive: false,
  })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetchFaq()
    fetchActiveFaq()
  }, [])

  const fetchFaq = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/faq`)
      setFaq(response.data)
    } catch (error) {
      console.error('getFaq error:', error)
      toast.error('Failed to fetch FAQ items')
    }
  }

  const fetchActiveFaq = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/faq/GetActive`)
      setActiveFaq(response.data)
    } catch (error) {
      console.error('getActiveFaq error:', error)
      toast.error('Failed to fetch active FAQ items')
    }
  }

  const handleCreateMenuItem = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/faq`, newMenuItem)
      toast.success('FAQ item created successfully')
      fetchFaq()
      setVisible(false)
    } catch (error) {
      console.error('createMenuItem error:', error)
      toast.error('Failed to create FAQ item')
    }
  }

  const handleUpdateMenuItem = async (faqId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/faq/${faqId}`, currentMenuItem)
      toast.success('FAQ item updated successfully')
      fetchFaq()
      setVisible(false)
    } catch (error) {
      console.error('updateMenuItem error:', error)
      toast.error('Failed to update FAQ item')
    }
  }

  const handleDeleteMenuItem = async (faqId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/faq/${faqId}`)
      toast.success('FAQ item deleted successfully')
      fetchFaq()
    } catch (error) {
      console.error('deleteMenuItem error:', error)
      toast.error('Failed to delete FAQ item')
    }
  }

  const handleEditButtonClick = async (faqId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/faq/${faqId}`)
      setCurrentMenuItem(response.data)
      setVisible(true)
    } catch (error) {
      console.error('Error fetching the FAQ item:', error)
      toast.error('Failed to fetch FAQ item')
    }
  }

  return (
    <div>
      <ToastContainer />
      <CButton color="primary" className="mb-3" onClick={() => setVisible(true)}>
        Yeni FAQ Ekle
      </CButton>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Soru Başlığı</CTableHeaderCell>
            <CTableHeaderCell scope="col">Sıra Numarası</CTableHeaderCell>
            <CTableHeaderCell scope="col">Aktiflik</CTableHeaderCell>
            <CTableHeaderCell scope="col">Eylemler</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {faq.map((item) => (
            <CTableRow key={item.faqId}>
              <CTableDataCell>{item.label}</CTableDataCell>
              <CTableDataCell>{item.orderNumber}</CTableDataCell>
              <CTableDataCell>{item.isActive ? 'Evet' : 'Hayır'}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => handleEditButtonClick(item.faqId)}
                >
                  Düzenle
                </CButton>
                <CButton color="danger text-white" onClick={() => handleDeleteMenuItem(item.faqId)}>
                  Sil
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{currentMenuItem ? 'Edit FAQ Item' : 'Create FAQ Item'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              className="mb-3"
              label="Soru Başlığı"
              value={currentMenuItem ? currentMenuItem.label : newMenuItem.label}
              onChange={(e) =>
                currentMenuItem
                  ? setCurrentMenuItem({ ...currentMenuItem, label: e.target.value })
                  : setNewMenuItem({ ...newMenuItem, label: e.target.value })
              }
            />
            <CFormTextarea
              type="text"
              className="mb-3"
              label="Metin"
              value={currentMenuItem ? currentMenuItem.text : newMenuItem.text}
              onChange={(e) =>
                currentMenuItem
                  ? setCurrentMenuItem({ ...currentMenuItem, text: e.target.value })
                  : setNewMenuItem({ ...newMenuItem, text: e.target.value })
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
              currentMenuItem ? handleUpdateMenuItem(currentMenuItem.faqId) : handleCreateMenuItem()
            }
          >
            {currentMenuItem ? 'Save Changes' : 'Create'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Faq
