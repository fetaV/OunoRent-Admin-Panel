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
  CFormTextarea,
  CRow,
  CCol,
} from '@coreui/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from '../../../../config'

function Blog() {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [largeImageUrl, setLargeImageUrl] = useState('')
  const [smallImageUrl, setSmallImageUrl] = useState('')
  const [tags, setTags] = useState('')
  const [slug, setSlug] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [editBlogId, setEditBlogId] = useState(null)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState('')
  const [editBlogData, setEditBlogData] = useState({
    blogId: '',
    subCategoryId: '',
    title: '',
    largeImagegUrl: '',
    smallImageUrl: '',
    tags: '',
    slug: '',
    orderNumber: 0,
    date: '',
    isActive: false,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_BASE_URL}/blog`, {
        title,
        body,
        largeImageUrl,
        smallImageUrl,
        tags,
        slug,
        orderNumber,
        isActive,
        subcategoryId: selectedSubCategoryId,
      })
      toast.success('Blog başarıyla eklendi!')
      setVisible(false)
    } catch (error) {
      console.error(error)
      toast.error('Failed to add Slider')
    }
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/Blog`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setBlogs(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchBlogs()
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

  const handleDelete = async (blogId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/blog/${blogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setBlogs(blogs.filter((blog) => blog.blogId !== blogId))
      toast.success('Blog başarıyla silindi!')
    } catch (error) {
      console.error(error.response.data)
      toast.error('Blog silinirken bir hata oluştu!')
    }
  }

  const handleEditModalOpen = async (blogId) => {
    const token = localStorage.getItem('token')
    const response = await axios.get(`${API_BASE_URL}/blog/${blogId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log('idblog', response)

    const blogData = response.data
    setEditBlogId(blogId)
    setEditBlogData(blogData)
    setTitle(blogData.title || '')
    setBody(blogData.body || '')
    setLargeImageUrl(blogData.largeImageUrl || '')
    setSmallImageUrl(blogData.smallImageUrl || '')
    setTags(blogData.tags || '')
    setSlug(blogData.slug || '')
    setOrderNumber(blogData.orderNumber || '')
    setIsActive(blogData.isActive || false)
    setSelectedSubCategoryId(blogData.subCategoryId || '')
    setSelectedCategoryId(blogData.categoryId || '')
    setVisible2(true)
  }

  const handleEdit = async (blogId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${API_BASE_URL}/Blog/${blogId}`,
        {
          blogId,
          subCategoryId: selectedSubCategoryId,
          title,
          largeImgUrl: largeImageUrl,
          smallImgUrl: smallImageUrl,
          tags,
          slug,
          orderNumber: parseInt(orderNumber, 10),
          date: new Date().toISOString(),
          isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      toast.success('Blog başarıyla güncellendi!')
      setVisible2(false)
    } catch (error) {
      console.error('Error response:', error.response)
      if (error.response && error.response.status === 409) {
        toast.error('Çakışma: Blog ID zaten mevcut veya veri çakışması yaşandı.')
      } else {
        toast.error('Blog güncellenirken hata oluştu.')
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <CButton color="primary" className="mb-3" onClick={() => setVisible(true)}>
        Yeni Blog Ekle
      </CButton>

      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Yeni Blog Ekle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow>
              <CCol>
                <CFormInput
                  type="text"
                  className="mb-3"
                  id="title"
                  label="Başlık"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </CCol>
              <CCol>
                <CFormInput
                  type="number"
                  className="mb-3"
                  id="orderNumber"
                  label="Sıra Numarası"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />
              </CCol>
            </CRow>
            <CFormTextarea
              type="text"
              className="mb-3"
              id="body"
              label="Metin"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <CFormInput
              type="text"
              className="mb-3"
              id="largeImageUrl"
              label="Büyük Resim"
              value={largeImageUrl}
              onChange={(e) => setLargeImageUrl(e.target.value)}
            />
            <CFormInput
              type="text"
              className="mb-3"
              id="smallImageUrl"
              label="Küçük Resim"
              value={smallImageUrl}
              onChange={(e) => setSmallImageUrl(e.target.value)}
            />

            <CFormInput
              type="text"
              className="mb-3"
              id="tags"
              label="Etiketler"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <CFormInput
              type="text"
              className="mb-3"
              id="slug"
              label="URL Adresi"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
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
          <CModalTitle id="LiveDemoExampleLabel2">Blog Düzenle</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              id="title"
              label="Başlık"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <CFormInput
              type="text"
              id="body"
              label="Ana Resim URL"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <CFormInput
              type="text"
              id="largeImageUrl"
              label="Mobil Resim URL"
              value={largeImageUrl}
              onChange={(e) => setLargeImageUrl(e.target.value)}
            />
            <CFormInput
              type="text"
              id="smallImageUrl"
              label="Hedef URL"
              value={smallImageUrl}
              onChange={(e) => setSmallImageUrl(e.target.value)}
            />
            <CFormInput
              type="number"
              id="orderNumber"
              label="Sıra Numarası"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
            <CFormInput
              type="text"
              id="tags"
              label="Süre"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <CFormInput
              type="text"
              id="slug"
              label="Aktif Başlangıç"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
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
              checked={isActive}
              onChange={() => setIsActive(!isActive)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible2(false)}>
            Kapat
          </CButton>
          <CButton color="primary" onClick={() => handleEdit(editBlogId)}>
            Değişiklikleri Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Başlık</CTableHeaderCell>
            <CTableHeaderCell scope="col">Sıra Numarası</CTableHeaderCell>
            <CTableHeaderCell scope="col">Büyük Resim</CTableHeaderCell>
            <CTableHeaderCell scope="col">Küçük Resim</CTableHeaderCell>
            <CTableHeaderCell scope="col">Etiketler</CTableHeaderCell>
            <CTableHeaderCell scope="col">URL Adresi</CTableHeaderCell>
            <CTableHeaderCell scope="col">Kategori</CTableHeaderCell>
            <CTableHeaderCell scope="col">Eylemler</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {blogs.map((blog) => (
            <CTableRow key={blog.blogId}>
              <CTableDataCell>{blog.title}</CTableDataCell>
              <CTableDataCell>{blog.orderNumber}</CTableDataCell>
              <CTableDataCell>{blog.largeImageUrl}</CTableDataCell>
              <CTableDataCell>{blog.smallImageUrl}</CTableDataCell>
              <CTableDataCell>{blog.tags}</CTableDataCell>
              <CTableDataCell>{blog.slug}</CTableDataCell>
              <CTableDataCell>{blog.subCategoryName}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => handleEditModalOpen(blog.blogId)}
                >
                  Düzenle
                </CButton>
                <CButton color="danger" onClick={() => handleDelete(blog.blogId)}>
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

export default Blog
