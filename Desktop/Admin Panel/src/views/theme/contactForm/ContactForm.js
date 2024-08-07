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
  CFormTextarea,
} from '@coreui/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from '../../../../config'

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const formattedDate = date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  return `${formattedDate} ${formattedTime}`
}

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
      console.log(response.data)
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
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              İsim
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Email
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Konu
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Kategori Konusu
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Tarih
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Eylemler
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {contactForm.map((item) => (
            <CTableRow key={item.contactFormId}>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {item.name}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {item.email}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {item.subject}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {item.subjectCategory}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {formatDate(item.formDate)}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
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
