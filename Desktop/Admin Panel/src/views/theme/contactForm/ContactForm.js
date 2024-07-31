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

const ContactForm = () => {
  const [contactForm, setContactForm] = useState([])
  const [currentMenuItem, setCurrentMenuItem] = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetchContactForm()
  }, [])

  const fetchContactForm = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contactForm`)
      setContactForm(response.data)
    } catch (error) {
      console.error('fetchContactForm error:', error)
      toast.error('Failed to fetch contact form items')
    }
  }

  const handleDeleteMenuItem = async (contactFormId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/contactform/${contactFormId}`)
      toast.success('Contact form item deleted successfully')
      fetchContactForm()
    } catch (error) {
      console.error('deleteMenuItem error:', error)
      toast.error('Failed to delete contact form item')
    }
  }

  const handleInspectButtonClick = async (contactFormId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contactform/${contactFormId}`)
      setCurrentMenuItem(response.data)
      setVisible(true)
    } catch (error) {
      console.error('Error fetching the contact form item:', error)
      toast.error('Failed to fetch contact form item')
    }
  }

  return (
    <div>
      <ToastContainer />
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">İsim</CTableHeaderCell>
            <CTableHeaderCell scope="col">Email</CTableHeaderCell>
            <CTableHeaderCell scope="col">Konu</CTableHeaderCell>
            <CTableHeaderCell scope="col">Kategori Konusu</CTableHeaderCell>
            <CTableHeaderCell scope="col">Metin</CTableHeaderCell>
            <CTableHeaderCell scope="col">Eylemler</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {contactForm.map((item) => (
            <CTableRow key={item.contactFormId}>
              <CTableDataCell>{item.name}</CTableDataCell>
              <CTableDataCell>{item.email}</CTableDataCell>
              <CTableDataCell>{item.subject}</CTableDataCell>
              <CTableDataCell>{item.subjectCategory}</CTableDataCell>
              <CTableDataCell>{item.body}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => handleInspectButtonClick(item.contactFormId)}
                >
                  İncele
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDeleteMenuItem(item.contactFormId)}
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
          <CModalTitle>İletişim Formu İncele</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {currentMenuItem && (
            <CForm>
              <CFormInput
                type="text"
                className="mb-3"
                label="İsim"
                value={currentMenuItem.name}
                readOnly
              />
              <CFormInput
                type="email"
                className="mb-3"
                label="Email"
                value={currentMenuItem.email}
                readOnly
              />
              <CFormInput
                type="text"
                className="mb-3"
                label="Konu"
                value={currentMenuItem.subject}
                readOnly
              />
              <CFormInput
                type="text"
                className="mb-3"
                label="Kategori Konusu"
                value={currentMenuItem.subjectCategory}
                readOnly
              />
              <CFormTextarea
                type="text"
                className="mb-3"
                label="Metin"
                value={currentMenuItem.body}
                readOnly
              />
            </CForm>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Kapat
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default ContactForm
