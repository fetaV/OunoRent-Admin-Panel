import React, { useEffect, useState } from 'react'
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
  CFormSelect,
  CRow,
  CCol,
} from '@coreui/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from '../../../../config'

function Address() {
  const [address, setAddress] = useState([])
  const [addressName, setaddressName] = useState('')
  const [addressType, setaddressType] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [editaddressId, setEditaddressId] = useState(null)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('')
  const [editaddressData, setEditaddressData] = useState({
    addressId: '',
    subCategoryId: '',
    addressName: '',
    largeImagegUrl: '',
    smallImageUrl: '',
    tags: '',
    slug: '',
    orderNumber: 0,
    date: '',
    isActive: false,
  })

  const handleSubmit = async (e) => {
    console.log({ addressName, addressType, subCategoryId: selectedCategoryId })
    e.preventDefault()
    try {
      await axios.post(`${API_BASE_URL}/address`, {
        addressName,
        addressType,
        categoryId: selectedCategoryId,
        subcategoryId: selectedSubCategoryId,
        isActive,
      })
      toast.success('address başarıyla eklendi!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setVisible(false)
    } catch (error) {
      console.error(error)
      toast.error('Failed to add Slider')
    }
  }

  useEffect(() => {
    const fetchaddress = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/address`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(response)
        setAddress(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchaddress()
  }, [])

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Categories:', response.data) / setCategories(response.data)
    } catch (error) {
      console.error(
        'Error fetching categories:',
        error.response ? error.response.data : error.message,
      )
    }
  }

  const fetchSubCategories = async (categoryId) => {
    try {
      console.log('Fetching subcategories for categoryId:', categoryId)
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/category/${categoryId}/subcategory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('Subcategories response:', response.data)
      setSubCategories(response.data)
    } catch (error) {
      console.error(
        'Error fetching subcategories:',
        error.response ? error.response.data : error.message,
      )
    }
  }

  useEffect(() => {
    fetchCategories()
    if (selectedCategoryId) {
      fetchSubCategories(selectedCategoryId)
    }
  }, [selectedCategoryId])

  const handleCategoryChange = (event) => {
    const selectedId = event.target.value
    setSelectedCategoryId(selectedId)
    fetchSubCategories(selectedId)
  }
  const handleSubCategoryChange = (event) => {
    const selectedId = event.target.value
    setSelectedSubCategoryId(selectedId)
    console.log(selectedId)
  }

  const handleDelete = async (addressId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/address/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setAddress(address.filter((address) => address.addressId !== addressId))
      toast.success('address başarıyla silindi!')
    } catch (error) {
      console.error(error.response.data)
      toast.error('address silinirken bir hata oluştu!')
    }
  }

  const handleEditModalOpen = async (addressId) => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_BASE_URL}/address/${addressId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('idaddress', response)

    const addressData = response.data
    setEditaddressId(addressId)
    setEditaddressData(addressData)
    setaddressName(addressData.addressName || '')
    setaddressType(addressData.addressType || '')
    setIsActive(addressData.isActive || false)
    setSelectedSubCategoryId(addressData.subCategory.subCategoryId || '')
    setSelectedCategoryId(addressData.subCategory.categoryId || '')
    setVisible2(true)
  }

  const handleEdit = async (addressId) => {
    console.log({
      addressId,
      subCategoryId: selectedSubCategoryId,
      categoryId: selectedCategoryId,
      addressName,
      addressType,
      isActive,
    })
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${API_BASE_URL}/address/${addressId}`,
        {
          addressId,
          subCategoryId: selectedSubCategoryId,
          categoryId: selectedCategoryId,
          addressName,
          addressType,
          isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      toast.success('address başarıyla güncellendi!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setVisible2(false)
    } catch (error) {
      console.error('Error response:', error.response)
      if (error.response && error.response.status === 409) {
        toast.error('Çakışma: address ID zaten mevcut veya veri çakışması yaşandı.')
      } else {
        toast.error('address güncellenirken hata oluştu.')
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <CButton color="primary" className="mb-3" onClick={() => setVisible(true)}>
        Yeni Adres Ekle
      </CButton>

      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Yeni address Ekle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              className="mb-3"
              id="addressName"
              label="Başlık"
              value={addressName}
              onChange={(e) => setaddressName(e.target.value)}
            />
            <CFormInput
              type="text"
              className="mb-3"
              id="addressType"
              label="Metin"
              value={addressType}
              onChange={(e) => setaddressType(e.target.value)}
            />
            <CFormSelect
              label="Kategori"
              className="mb-3"
              aria-label="Select category"
              onChange={handleCategoryChange}
              value={selectedCategoryId}
            >
              <option value="">Kategori Seçiniz</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </CFormSelect>

            <CFormSelect
              label="Alt Kategori"
              className="mb-3"
              aria-label="Select subcategory"
              onChange={handleSubCategoryChange}
              value={selectedSubCategoryId}
            >
              <option value="">Lütfen Önce Kategori Seçiniz</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory.subCategoryId} value={subCategory.subCategoryId}>
                  {subCategory.name}
                </option>
              ))}
            </CFormSelect>

            <CFormSwitch
              id="isActive"
              label="Aktif"
              className="mb-3"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Kapat
          </CButton>
          <CButton color="primary" onClick={handleSubmit}>
            Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={visible2}
        onClose={() => setVisible2(false)}
        aria-labelledby="LiveDemoExampleLabel2"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel2">address Düzenle</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              id="addressName"
              label="Başlık"
              value={addressName}
              onChange={(e) => setaddressName(e.target.value)}
            />
            <CFormInput
              type="text"
              id="addressType"
              label="Ana Resim URL"
              value={addressType}
              onChange={(e) => setaddressType(e.target.value)}
            />
            <CFormSelect
              label="Kategori"
              className="mb-3"
              aria-label="Select category"
              onChange={handleCategoryChange}
              value={selectedCategoryId || ''} // Ensure value is set correctly
            >
              <option value="">Kategori Seçiniz</option>
              {categories.map((category) => (
                <option key={category.categoryId} value={category.categoryId}>
                  {category.name}
                </option>
              ))}
            </CFormSelect>

            <CFormSelect
              label="Alt Kategori"
              className="mb-3"
              aria-label="Select subcategory"
              onChange={handleSubCategoryChange}
              value={selectedSubCategoryId || ''} // Ensure value is set correctly
            >
              <option value="">Lütfen Önce Kategori Seçiniz</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory.subCategoryId} value={subCategory.subCategoryId}>
                  {subCategory.name}
                </option>
              ))}
            </CFormSelect>

            <CFormSwitch
              id="isActive"
              label="Aktif"
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible2(false)}>
            Kapat
          </CButton>
          <CButton color="primary" onClick={() => handleEdit(editaddressId)}>
            Değişiklikleri Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Başlık</CTableHeaderCell>
            <CTableHeaderCell scope="col">Sıra Numarası</CTableHeaderCell>
            <CTableHeaderCell scope="col">Durum</CTableHeaderCell>
            <CTableHeaderCell scope="col">Eylemler</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {address.map((address) => (
            <CTableRow key={address.addressId}>
              <CTableDataCell>{address.addressName}</CTableDataCell>
              <CTableDataCell>{address.addressType}</CTableDataCell>
              <CTableDataCell>{address.isActive ? 'Aktif' : 'Pasif'}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => handleEditModalOpen(address.addressId)}
                >
                  Düzenle
                </CButton>
                <CButton color="danger text-white" onClick={() => handleDelete(address.addressId)}>
                  Sil
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  )
}

export default Address
