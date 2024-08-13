import React, { useEffect, useState } from 'react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
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
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from '../../../../config'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import '../blog/ckeditor-styles.css'

function Blog() {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [largeImage, setLargeImage] = useState('')
  const [smallImage, setSmallImage] = useState('')
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
    largeImageg: '',
    smallImage: '',
    tags: '',
    slug: '',
    orderNumber: 0,
    date: '',
    isActive: false,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredBlog, setFilteredBlog] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase()

    const filteredData = blogs
      .filter(
        (blog) =>
          blog.title?.toLowerCase().includes(lowercasedQuery) ||
          blog.tags?.toLowerCase().includes(lowercasedQuery) ||
          blog.subCategoryName?.toLowerCase().includes(lowercasedQuery),
      )
      .sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1))

    setFilteredBlog(filteredData)
  }, [searchQuery, blogs])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('body', body)
    formData.append('largeImage', largeImage)
    formData.append('smallImage', smallImage)
    formData.append('tags', tags)
    formData.append('slug', slug)
    formData.append('orderNumber', orderNumber)
    formData.append('isActive', isActive)
    formData.append('subCategoryId', selectedSubCategoryId)
    console.log({
      title,
      body,
      largeImage,
      smallImage,
      tags,
      slug,
      orderNumber,
      isActive,
      selectedSubCategoryId,
    })

    try {
      await axios.post(`${API_BASE_URL}/blog`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Blog başarıyla eklendi!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setVisible(false)
      setTitle('')
      setBody('')
      setLargeImage('')
      setSmallImage('')
      setTags('')
      setSlug('')
      setOrderNumber('')
      setIsActive('')
    } catch (error) {
      console.error(error)
      toast.error('Blog eklenirken bir hata oluştu!')
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
        console.log(response.data)
        setBlogs(response.data)
        setFilteredBlog(response.data)
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
      setFilteredBlog(blogs.filter((blog) => blog.blogId !== blogId))
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
    setLargeImage(blogData.largeImage || '')
    setSmallImage(blogData.smallImage || '')
    setTags(blogData.tags || '')
    setSlug(blogData.slug || '')
    setOrderNumber(blogData.orderNumber || '')
    setIsActive(blogData.isActive || false)
    setSelectedSubCategoryId(blogData.subCategoryId || '')
    setSelectedCategoryId(blogData.categoryId || '')
    setVisible2(true)
  }

  const handleEdit = async (blogId) => {
    const formData = new FormData()
    formData.append('BlogId', blogId)
    formData.append('SubCategoryId', selectedSubCategoryId)
    formData.append('Title', title)
    formData.append('Tags', tags)
    formData.append('Slug', slug)
    formData.append('OrderNumber', orderNumber)
    formData.append('Date', new Date().toISOString())
    formData.append('IsActive', isActive)
    formData.append('LargeImage', largeImage)
    formData.append('SmallImage', smallImage)
    formData.append('Body', body)

    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_BASE_URL}/Blog/${blogId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Blog başarıyla güncellendi!')
      setInterval(() => {
        window.location.reload()
      }, 500)
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

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredBlog.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredBlog.length / itemsPerPage)

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
            <div className="mb-3">
              <label htmlFor="body" className="form-label">
                Metin
              </label>

              <CKEditor
                editor={ClassicEditor}
                data={body}
                onChange={(event, editor) => {
                  const data = editor.getData()
                  setBody(data)
                }}
              />
            </div>
            <CFormInput
              type="file"
              className="mb-3"
              id="largeImage"
              label="Büyük Resim"
              onChange={(e) => setLargeImage(e.target.files[0])}
            />
            <CFormInput
              type="file"
              className="mb-3"
              id="smallImage"
              label="Küçük Resim"
              onChange={(e) => setSmallImage(e.target.files[0])}
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
              label={isActive ? 'Aktif' : 'Pasif'}
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
            <div className="mb-3">
              <label htmlFor="body" className="form-label">
                Metin
              </label>
              <CKEditor
                editor={ClassicEditor}
                data={body}
                onChange={(event, editor) => {
                  const data = editor.getData()
                  setBody(data)
                }}
              />
            </div>
            <CFormInput
              type="number"
              id="orderNumber"
              label="Sıra Numarası"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
            <CFormInput
              type="file"
              id="largeImage"
              label="Büyük Resim"
              onChange={(e) => setLargeImage(e.target.files[0])}
            />
            <CFormInput
              type="file"
              id="smallImage"
              label="Küçük Resim"
              onChange={(e) => setSmallImage(e.target.files[0])}
            />
            <CFormInput
              type="text"
              id="tags"
              label="Etiket"
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
              label={isActive ? 'Aktif' : 'Pasif'}
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
              Başlık
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Sıra Numarası
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Büyük Resim
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Küçük Resim
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Etiketler
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Slug
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Alt Kategori
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
          {currentItems.map((blog) => (
            <CTableRow key={blog.blogId}>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {blog.title}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {blog.orderNumber}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img
                    src={`http://10.10.3.181:5244/${blog.largeImageUrl}`}
                    alt="Büyük Resim"
                    style={{
                      width: '100px',
                      height: 'auto',
                    }}
                  />
                </div>
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img
                    src={`http://10.10.3.181:5244/${blog.smallImageUrl}`}
                    alt="Küçük Resim"
                    style={{
                      width: '50px',
                      height: 'auto',
                    }}
                  />
                </div>
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {blog.tags}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {blog.slug}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                {blog.subCategoryName}
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <div
                  style={{
                    display: 'inline-block',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    backgroundColor: blog.isActive ? '#d4edda' : '#f8d7da',
                    color: blog.isActive ? '#155724' : '#721c24',
                    border: `1px solid ${blog.isActive ? '#c3e6cb' : '#f5c6cb'}`,
                  }}
                >
                  {blog.isActive ? 'Aktif' : 'Pasif'}
                </div>
              </CTableDataCell>
              <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => handleEditModalOpen(blog.blogId)}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton color="danger text-white" onClick={() => handleDelete(blog.blogId)}>
                  <CIcon icon={cilTrash} />
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

export default Blog
