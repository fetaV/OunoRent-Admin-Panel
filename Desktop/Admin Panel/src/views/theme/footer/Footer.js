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
  CPagination,
  CPaginationItem,
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
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredFooter, setFilteredFooter] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchfooter()
  }, [])

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase()
    const filteredData = footer.filter(
      (footer) =>
        (footer.label && footer.label.toLowerCase().includes(lowercasedQuery)) ||
        (footer.targetUrl && footer.targetUrl.toLowerCase().includes(lowercasedQuery)) ||
        (footer.column && footer.column.toLowerCase().includes(lowercasedQuery)) ||
        (footer.orderNumber &&
          footer.orderNumber.toString().toLowerCase().includes(lowercasedQuery)),
    )
    setFilteredFooter(filteredData)
  }, [searchQuery, footer])

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

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredFooter.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredFooter.length / itemsPerPage)

  return (
    <div>
      <ToastContainer />
      <CButton color="primary" className="mb-3" onClick={() => setVisible(true)}>
        Yeni Footer Ekle
      </CButton>
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
              Menü Başlığı
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Sıra Numarası
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Sütun
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Hedef URL
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Durum
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Eylemler
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((item) => (
            <CTableRow key={item.footerItemId}>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {item.label}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {item.orderNumber}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {item.column}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {item.targetUrl}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    backgroundColor: item.isActive ? '#d4edda' : '#f8d7da',
                    color: item.isActive ? '#155724' : '#721c24',
                    border: `1px solid ${item.isActive ? '#c3e6cb' : '#f5c6cb'}`,
                  }}
                >
                  {item.isActive ? 'Aktif' : 'Pasif'}
                </div>
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
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
              id="isActive"
              label={
                currentFooter
                  ? currentFooter.isActive
                    ? 'Aktif'
                    : 'Pasif'
                  : newFooter.isActive
                    ? 'Aktif'
                    : 'Pasif'
              }
              className="mb-3"
              checked={currentFooter ? currentFooter.isActive : newFooter.isActive}
              onChange={() =>
                currentFooter
                  ? setCurrentFooter({ ...currentFooter, isActive: !currentFooter.isActive })
                  : setNewFooter({ ...newFooter, isActive: !newFooter.isActive })
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
