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

function Feature() {
  const [features, setFeatures] = useState([])
  const [featureName, setFeatureName] = useState('')
  const [featureType, setFeatureType] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [editFeatureId, setEditFeatureId] = useState(null)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('')
  const [editfeatureData, setEditfeatureData] = useState({
    featureId: '',
    subCategoryId: '',
    featureName: '',
    largeImagegUrl: '',
    smallImageUrl: '',
    tags: '',
    slug: '',
    orderNumber: 0,
    date: '',
    isActive: false,
  })

  const handleSubmit = async (e) => {
    console.log({ featureName, featureType, subCategoryId: selectedCategoryId })
    e.preventDefault()
    try {
      await axios.post(`${API_BASE_URL}/feature`, {
        featureName,
        featureType,
        categoryId: selectedCategoryId,
        subcategoryId: selectedSubCategoryId,
        isActive,
      })
      toast.success('feature başarıyla eklendi!')
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
    const fetchfeatures = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/feature`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(response)
        setFeatures(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchfeatures()
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

  const handleDelete = async (featureId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/feature/${featureId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setFeatures(features.filter((feature) => feature.featureId !== featureId))
      toast.success('feature başarıyla silindi!')
    } catch (error) {
      console.error(error.response.data)
      toast.error('feature silinirken bir hata oluştu!')
    }
  }

  const handleEditModalOpen = async (featureId) => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_BASE_URL}/feature/${featureId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('idfeature', response)

    const featureData = response.data
    setEditFeatureId(featureId)
    setEditfeatureData(featureData)
    setFeatureName(featureData.featureName || '')
    setFeatureType(featureData.featureType || '')
    setIsActive(featureData.isActive || false)
    setSelectedSubCategoryId(featureData.subCategory.subCategoryId || '')
    setSelectedCategoryId(featureData.subCategory.categoryId || '')
    setVisible2(true)
  }

  const handleEdit = async (featureId) => {
    console.log({
      featureId,
      subCategoryId: selectedSubCategoryId,
      categoryId: selectedCategoryId,
      featureName,
      featureType,
      isActive,
    })
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${API_BASE_URL}/feature/${featureId}`,
        {
          featureId,
          subCategoryId: selectedSubCategoryId,
          categoryId: selectedCategoryId,
          featureName,
          featureType,
          isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      toast.success('Feature başarıyla güncellendi!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setVisible2(false)
    } catch (error) {
      console.error('Error response:', error.response)
      if (error.response && error.response.status === 409) {
        toast.error('Çakışma: Feature ID zaten mevcut veya veri çakışması yaşandı.')
      } else {
        toast.error('Feature güncellenirken hata oluştu.')
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <CButton color="primary" className="mb-3" onClick={() => setVisible(true)}>
        Yeni feature Ekle
      </CButton>

      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Yeni feature Ekle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              className="mb-3"
              id="featureName"
              label="Başlık"
              value={featureName}
              onChange={(e) => setFeatureName(e.target.value)}
            />
            <CFormInput
              type="text"
              className="mb-3"
              id="featureType"
              label="Metin"
              value={featureType}
              onChange={(e) => setFeatureType(e.target.value)}
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
          <CModalTitle id="LiveDemoExampleLabel2">feature Düzenle</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              id="featureName"
              label="Başlık"
              value={featureName}
              onChange={(e) => setFeatureName(e.target.value)}
            />
            <CFormInput
              type="text"
              id="featureType"
              label="Ana Resim URL"
              value={featureType}
              onChange={(e) => setFeatureType(e.target.value)}
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
          <CButton color="primary" onClick={() => handleEdit(editFeatureId)}>
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
          {features.map((feature) => (
            <CTableRow key={feature.featureId}>
              <CTableDataCell>{feature.featureName}</CTableDataCell>
              <CTableDataCell>{feature.featureType}</CTableDataCell>
              <CTableDataCell>{feature.isActive ? 'Aktif' : 'Pasif'}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => handleEditModalOpen(feature.featureId)}
                >
                  Düzenle
                </CButton>
                <CButton color="danger text-white" onClick={() => handleDelete(feature.featureId)}>
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

export default Feature
