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
  CFormSelect,
  CFormSwitch,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from '../../../../config'

const FeaturedCategories = () => {
  const [featuredCategories, setFeaturedCategories] = useState([])
  const [categories, setCategories] = useState([])
  const [orderNumber, setOrderNumber] = useState('')
  const [editCategoryId, setEditCategoryId] = useState(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredFeaturedCategories, setFilteredFeaturedCategories] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase()
    const filteredData = featuredCategories
      .filter((featuredCategory) =>
        (featuredCategory.getCategoryResponse?.name || '').toLowerCase().includes(lowercasedQuery),
      )
      .sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1))

    setFilteredFeaturedCategories(filteredData)
  }, [searchQuery, featuredCategories])

  const newCategory = async (e) => {
    console.log('Sending request with data:', {
      categoryId: selectedCategoryId,
      orderNumber: parseInt(orderNumber, 10),
      isActive,
    })
    e.preventDefault()
    try {
      const response = await axios.post(`${API_BASE_URL}/FeaturedCategory`, {
        categoryId: selectedCategoryId,
        orderNumber: parseInt(orderNumber, 10),
        isActive,
      })
      setFeaturedCategories([...featuredCategories, response.data])
      setFilteredFeaturedCategories([...featuredCategories, response.data])
      toast.success('Başarıyla Kayıt İşlemi Gerçekleşti!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setOrderNumber('')
      setVisible(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCategoryChange = (event) => {
    const selectedId = event.target.value
    setSelectedCategoryId(selectedId)
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/category`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('categoryyy', response)
        setCategories(response.data)
        setFilteredFeaturedCategories(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchfeaturedCategories = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/featuredcategory`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log('featured', response)
        setFeaturedCategories(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchfeaturedCategories()
  }, [])

  const handleDelete = async (featuredCategoryId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/FeaturedCategory/${featuredCategoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setFeaturedCategories(
        featuredCategories.filter(
          (featuredCategory) => featuredCategory.featuredCategoryId !== featuredCategoryId,
        ),
      )
      toast.success('Başarıyla Kayıt Silindi!')
    } catch (error) {
      console.error(error.response.data)
    }
  }

  const categoryEdit = async (featuredCategoryId) => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_BASE_URL}/featuredCategory/${featuredCategoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const categoryData = response.data.getCategoryResponse

    // Kategori verilerini state'e atıyoruz
    setEditCategoryId(featuredCategoryId)
    setSelectedCategoryId(categoryData.categoryId || '')
    setOrderNumber(categoryData.orderNumber || '')
    setIsActive(categoryData.isActive || false)
    setVisible2(true)
  }

  const handleEdit = async () => {
    console.log({
      featuredCategoryId: editCategoryId,
      categoryId: selectedCategoryId,
      orderNumber: parseInt(orderNumber, 10),
      isActive,
    })
    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${API_BASE_URL}/FeaturedCategory/${editCategoryId}`,
        {
          featuredCategoryId: editCategoryId,
          categoryId: selectedCategoryId,
          orderNumber: parseInt(orderNumber, 10),
          isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setFeaturedCategories(
        featuredCategories.map((category) =>
          category.featuredCategoryId === editCategoryId ? response.data : category,
        ),
      )
      toast.success('Kategori başarıyla güncellendi!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setVisible2(false) // Edit modalı kapat
    } catch (error) {
      console.error(error)
      toast.error(error.message)
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredFeaturedCategories.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredFeaturedCategories.length / itemsPerPage)

  return (
    <>
      <ToastContainer />
      <CModal
        visible={visible2}
        onClose={() => setVisible2(false)}
        aria-labelledby="LiveDemoExampleLabel2"
      >
        <CModalHeader>
          <CModalTitle>Öne Çıkan Kategori Düzenle</CModalTitle>
        </CModalHeader>
        <CModalBody>
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

          <CForm className="mt-3">
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              label="Sıra No"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible2(false)}>
            Kapat
          </CButton>
          <CButton color="primary" onClick={() => handleEdit(editCategoryId)}>
            Değişiklikleri Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

      <CButton color="primary" className="mb-3" onClick={() => setVisible(!visible)}>
        Yeni Öne Çıkan Kategori Ekle
      </CButton>
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Yeni Kategori Ekle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormSelect
            label="Kategori"
            className="mb-3"
            aria-label="Select category"
            onChange={handleCategoryChange}
            value={selectedCategoryId || ''}
          >
            <option value="">Kategori Seçiniz</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </CFormSelect>

          <CForm className="mt-3">
            <CFormInput
              type="number"
              id="exampleFormControlInput1"
              label="Sıra No"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </CForm>
          <CFormSwitch
            id="isActive"
            label={isActive ? 'Aktif' : 'Pasif'}
            className="mt-3"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={newCategory}>
            Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

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
              Kategori Adı
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
          {currentItems.map((featuredCategory, index) => (
            <CTableRow key={index}>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {featuredCategory.getCategoryResponse?.name}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    backgroundColor: featuredCategory.isActive ? '#d4edda' : '#f8d7da',
                    color: featuredCategory.isActive ? '#155724' : '#721c24',
                    border: `1px solid ${featuredCategory.isActive ? '#c3e6cb' : '#f5c6cb'}`,
                  }}
                >
                  {featuredCategory.isActive ? 'Aktif' : 'Pasif'}
                </div>
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => categoryEdit(featuredCategory.featuredCategoryId)}
                >
                  Düzenle
                </CButton>
                <CButton
                  color="danger text-white"
                  className="me-2"
                  onClick={() => handleDelete(featuredCategory.featuredCategoryId)}
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
    </>
  )
}

export default FeaturedCategories
