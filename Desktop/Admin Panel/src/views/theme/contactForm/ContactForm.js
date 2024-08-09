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
  CPagination,
  CPaginationItem,
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
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredContactForm, setFilteredContactForm] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase()
    const filteredData = contactForm.filter(
      (contactForm) =>
        contactForm.email.toLowerCase().includes(lowercasedQuery) ||
        contactForm.name.toLowerCase().includes(lowercasedQuery) ||
        contactForm.subject.toLowerCase().includes(lowercasedQuery) ||
        contactForm.subjectCategory.toLowerCase().includes(lowercasedQuery) ||
        contactForm.formDate.toLowerCase().includes(lowercasedQuery),
    )
    setFilteredContactForm(filteredData)
  }, [searchQuery, contactForm])

  useEffect(() => {
    fetchContactForm()
  }, [])

  const fetchContactForm = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contactForm`)
      console.log(response.data)
      setContactForm(response.data)
      setFilteredContactForm(response.data)
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

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredContactForm.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredContactForm.length / itemsPerPage)
  return (
    <div>
      <ToastContainer />
      <CFormInput
        type="text"
        id="search"
        placeholder="Arama"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
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
          {currentItems.map((item) => (
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
      <CPagination
        aria-label="Page navigation"
        className="mt-3 btn border-0"
        align="center"
        items={totalPages}
        active={currentPage}
        onChange={(page) => setCurrentPage(page)}
      >
        {[...Array(totalPages).keys()].map((page) => (
          <CPaginationItem
            key={page + 1}
            active={page + 1 === currentPage}
            onClick={() => setCurrentPage(page + 1)}
          >
            {page + 1}
          </CPaginationItem>
        ))}
      </CPagination>

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
                rows={8}
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
