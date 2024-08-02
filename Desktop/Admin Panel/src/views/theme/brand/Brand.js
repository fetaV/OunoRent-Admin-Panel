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

const Brand = () => {
  const [brand, setBrand] = useState([])
  const [currentBrand, setCurrentBrand] = useState(null)
  const [newBrand, setNewBrand] = useState({
    label: '',
    text: '',
    orderNumber: 0,
    isActive: false,
  })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetchbrand()
  }, [])

  const fetchbrand = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brand`)
      setBrand(response.data)
    } catch (error) {
      console.error('getbrand error:', error)
      toast.error('Failed to fetch brand items')
    }
  }

  const handleCreateBrand = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/brand`, newBrand)
      toast.success('brand item created successfully')
      fetchbrand()
      setVisible(false)
      setNewBrand({
        label: '',
        text: '',
        orderNumber: 0,
        isActive: false,
      })
    } catch (error) {
      console.error('createBrand error:', error)
      toast.error('Failed to create brand item')
    }
  }

  const handleUpdateBrand = async (brandId) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/brand/${brandId}`, currentBrand)
      toast.success('brand item updated successfully')
      fetchbrand()
      setVisible(false)
    } catch (error) {
      console.error('updateBrand error:', error)
      toast.error('Failed to update brand item')
    }
  }

  const handleDeleteBrand = async (brandId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/brand/${brandId}`)
      toast.success('brand item deleted successfully')
      fetchbrand()
    } catch (error) {
      console.error('deleteBrand error:', error)
      toast.error('Failed to delete brand item')
    }
  }

  const handleEditButtonClick = async (brandId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brand/${brandId}`)
      setCurrentBrand(response.data)
      setVisible(true)
    } catch (error) {
      console.error('Error fetching the brand item:', error)
      toast.error('Failed to fetch brand item')
    }
  }

  return (
    <div>
      <ToastContainer />
      <CButton color="primary" className="mb-3" onClick={() => setVisible(true)}>
        Yeni brand Ekle
      </CButton>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Marka Adı</CTableHeaderCell>
            <CTableHeaderCell scope="col">Logo</CTableHeaderCell>
            <CTableHeaderCell scope="col">Markalarda Göster</CTableHeaderCell>
            <CTableHeaderCell scope="col">Durum</CTableHeaderCell>
            <CTableHeaderCell scope="col">Eylemler</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {brand.map((item) => (
            <CTableRow key={item.brandId}>
              <CTableDataCell>{item.name}</CTableDataCell>
              <CTableDataCell>{item.logo}</CTableDataCell>
              <CTableDataCell>{item.showOnBrands ? 'Aktif' : 'Pasif'}</CTableDataCell>
              <CTableDataCell>{item.isActive ? 'Aktif' : 'Pasif'}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => handleEditButtonClick(item.brandId)}
                >
                  Düzenle
                </CButton>
                <CButton color="danger text-white" onClick={() => handleDeleteBrand(item.brandId)}>
                  Sil
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>{currentBrand ? 'Edit brand Item' : 'Create brand Item'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              className="mb-3"
              label="Marka Adı"
              value={currentBrand ? currentBrand.name : newBrand.name}
              onChange={(e) =>
                currentBrand
                  ? setCurrentBrand({ ...currentBrand, name: e.target.value })
                  : setNewBrand({ ...newBrand, name: e.target.value })
              }
            />
            <CFormInput
              type="text"
              className="mb-3"
              label="Metin"
              value={currentBrand ? currentBrand.logo : newBrand.logo}
              onChange={(e) =>
                currentBrand
                  ? setCurrentBrand({ ...currentBrand, logo: e.target.value })
                  : setNewBrand({ ...newBrand, logo: e.target.value })
              }
            />
            <CFormSwitch
              label="Markalarda Göster"
              checked={currentBrand ? currentBrand.showOnBrands : newBrand.showOnBrands}
              onChange={(e) =>
                currentBrand
                  ? setCurrentBrand({ ...currentBrand, showOnBrands: e.target.checked })
                  : setNewBrand({ ...newBrand, showOnBrands: e.target.checked })
              }
            />
            <CFormSwitch
              label="Durum"
              checked={currentBrand ? currentBrand.isActive : newBrand.isActive}
              onChange={(e) =>
                currentBrand
                  ? setCurrentBrand({ ...currentBrand, isActive: e.target.checked })
                  : setNewBrand({ ...newBrand, isActive: e.target.checked })
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
              currentBrand ? handleUpdateBrand(currentBrand.brandId) : handleCreateBrand()
            }
          >
            {currentBrand ? 'Save Changes' : 'Create'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Brand
