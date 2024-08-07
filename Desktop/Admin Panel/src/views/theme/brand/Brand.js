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

const Brand = () => {
  const [brand, setBrand] = useState([])
  const [currentBrand, setCurrentBrand] = useState(null)
  const [newBrand, setNewBrand] = useState({
    name: '',
    logo: null,
    showOnBrands: false,
    isActive: false,
  })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    fetchBrand()
  }, [])

  const fetchBrand = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/brand`)
      setBrand(response.data)
    } catch (error) {
      console.error('Fetch brand error:', error)
      toast.error('Failed to fetch brand items')
    }
  }

  const handleCreateBrand = async () => {
    const formData = new FormData()
    formData.append('name', newBrand.name)
    if (newBrand.logo) formData.append('logo', newBrand.logo)
    formData.append('showOnBrands', newBrand.showOnBrands)
    formData.append('isActive', newBrand.isActive)

    try {
      const response = await axios.post(`${API_BASE_URL}/brand`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Brand item created successfully')
      fetchBrand()
      setVisible(false)
      setNewBrand({
        name: '',
        logo: null,
        showOnBrands: false,
        isActive: false,
      })
    } catch (error) {
      console.error('Create brand error:', error)
      toast.error('Failed to create brand item')
    }
  }

  const handleUpdateBrand = async (brandId) => {
    const formData = new FormData()
    formData.append('brandId', brandId)
    formData.append('name', currentBrand.name)
    if (currentBrand.logo) formData.append('logo', currentBrand.logo)
    formData.append('showOnBrands', currentBrand.showOnBrands)
    formData.append('isActive', currentBrand.isActive)

    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_BASE_URL}/brand/${brandId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Brand item updated successfully')
      fetchBrand()
      setVisible(false)
    } catch (error) {
      console.error('Update brand error:', error)
      toast.error('Failed to update brand item')
    }
  }

  const handleDeleteBrand = async (brandId) => {
    try {
      await axios.delete(`${API_BASE_URL}/brand/${brandId}`)
      toast.success('Brand item deleted successfully')
      fetchBrand()
    } catch (error) {
      console.error('Delete brand error:', error)
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
        Yeni Brand Ekle
      </CButton>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Marka Adı
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Logo
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Markalarda Göster
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
          {brand.map((item) => (
            <CTableRow key={item.brandId}>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {item.name}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <img
                  src={`http://10.10.3.181:5244/${item.logo}`}
                  alt="Mobil Resim"
                  style={{
                    width: '50px',
                    Height: 'auto',
                  }}
                />
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {item.showOnBrands ? 'Aktif' : 'Pasif'}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {item.isActive ? 'Aktif' : 'Pasif'}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
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

      <CModal
        visible={visible}
        onClose={() => {
          setVisible(false)
          setCurrentBrand(null) // Modal kapandığında mevcut markayı sıfırla
        }}
      >
        <CModalHeader>
          <CModalTitle>{currentBrand ? 'Edit Brand Item' : 'Create Brand Item'}</CModalTitle>
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
            {currentBrand && currentBrand.logo && (
              <div>
                <label>Mevcut Logo</label>
                <img
                  src={`http://10.10.3.181:5244/${currentBrand.logo}`}
                  alt="Mobil Resim"
                  style={{
                    maxWidth: '100px',
                    maxHeight: '100px',
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              </div>
            )}
            <CFormInput
              type="file"
              className="mb-3"
              label="Logo"
              onChange={(e) =>
                currentBrand
                  ? setCurrentBrand({ ...currentBrand, logo: e.target.files[0] })
                  : setNewBrand({ ...newBrand, logo: e.target.files[0] })
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
          <CButton
            color="secondary"
            onClick={() => {
              setVisible(false)
              setCurrentBrand(null) // Modal kapandığında mevcut markayı sıfırla
            }}
          >
            Kapat
          </CButton>
          <CButton
            color="primary"
            onClick={() =>
              currentBrand ? handleUpdateBrand(currentBrand.brandId) : handleCreateBrand()
            }
          >
            {currentBrand ? 'Değişiklikleri Kaydet' : 'Oluştur'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default Brand
