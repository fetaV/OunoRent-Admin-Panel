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
} from '@coreui/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from '../../../../config'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [icon, setIcon] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [imageHorizontal, setImageHorizontal] = useState('')
  const [imageSquare, setImageSquare] = useState('')
  const [editCategoryId, setEditCategoryId] = useState(null)
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [visible3, setVisible3] = useState(false)
  const [visible4, setVisible4] = useState(false)
  const [parentCategoryId, setParentCategoryId] = useState(null)
  const [subCategories, setSubCategories] = useState('')
  const [editSubCategoryId, setEditSubCategoryId] = useState('')
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)

  const newCategory = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('icon', icon) // icon bir dosya olduğunda
    formData.append('orderNumber', orderNumber)
    if (imageHorizontal) {
      formData.append('imageHorizontal', imageHorizontal)
    }
    if (imageSquare) {
      formData.append('imageSquare', imageSquare)
    }
    console.log({ name, description, icon, orderNumber, imageHorizontal, imageSquare })

    try {
      const response = await axios.post(`${API_BASE_URL}/category`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setCategories([...categories, response.data])
      toast.success('Başarıyla Kayıt İşlemi Gerçekleşti!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setName('')
      setDescription('')
      setIcon('')
      setOrderNumber('')
      setImageHorizontal('')
      setImageSquare('')
      setVisible(false)
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const errorMessage = Object.values(error.response.data.errors).flat().join(' ')
        toast.error(errorMessage)
        console.error(errorMessage)
      } else if (error.response.data) {
        const errorMessages = Object.values(error.response.data).flat().join('')
        toast.error(errorMessages)
      } else {
        toast.error('Bir hata oluştu.')
        console.error(error)
      }
    }
  }

  const handleSubCategoryEdit = (categoryId) => {
    setParentCategoryId(categoryId)
    setVisible4(true) // Modal'ı aç
  }

  const newSubCategory = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${API_BASE_URL}/category/${parentCategoryId}/subcategory`,
        {
          name,
          description,
          icon,
          orderNumber,
        },
      )
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.categoryId === parentCategoryId
            ? {
                ...category,
                subCategories: [...(category.subCategories || []), response.data],
              }
            : category,
        ),
      )
      toast.success('Alt kategori başarıyla eklendi!')
      setName('')
      setDescription('')
      setIcon('')
      setOrderNumber('')
      setVisible4(false)
      setInterval(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error(error)
      toast.error('Alt kategori eklenirken bir hata oluştu!')
    }
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
        setCategories(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    const fetchSubCategories = async (categoryId) => {
      console.log('123', categoryId)
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/category/${categoryId}/subcategory`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setSubCategories(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchCategories()
    if (selectedCategoryId) {
      fetchSubCategories(selectedCategoryId)
    }
  }, [selectedCategoryId])

  const handleDelete = async (categoryId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setCategories(categories.filter((category) => category.categoryId !== categoryId))
      toast.success('Başarıyla Kayıt Silindi!')
    } catch (error) {
      console.error(error.response.data)
    }
  }

  const handleSubCategoryDelete = async (subCategoryId) => {
    console.log(subCategoryId)
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/category/subcategory/${subCategoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setSubCategories(
        subCategories.filter((subCategory) => subCategory.subCategoryId !== subCategoryId),
      )
      toast.success('Alt kategori başarıyla silindi!')
    } catch (error) {
      console.error(error.response.data)
      toast.error('Alt kategori silinirken bir hata oluştu.')
    }
  }
  const editSubCategory = async (categoryId, subCategoryId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${API_BASE_URL}/category/${categoryId}/subcategory/${subCategoryId}`,
        {
          categoryId,
          subCategoryId,
          name,
          description,
          icon,
          orderNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      setSubCategories(
        subCategories.map(
          (subCategory) =>
            subCategory.subCategoryId === subCategoryId
              ? { ...subCategory, name, description, icon, orderNumber }
              : subCategory, // Updated state manipulation logic
        ),
      )
      toast.success('Alt kategori başarıyla güncellendi!') // Changed success message
      setVisible3(false)
    } catch (error) {
      console.error(error.response.data)
      toast.error('Alt kategori güncellenirken bir hata oluştu.') // Changed error message
    }
  }

  const categoryEdit = async (categoryId) => {
    setEditCategoryId(categoryId)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const categoryToEdit = response.data
      setName(categoryToEdit.name)
      setDescription(categoryToEdit.description)
      setIcon(categoryToEdit.icon)
      setOrderNumber(categoryToEdit.orderNumber)
      setImageHorizontal(categoryToEdit.imageHorizontal)
      setImageSquare(categoryToEdit.imageSquare)
      setVisible2(true)
    } catch (error) {
      console.error(error)
      toast.error('Kategori bilgileri getirilirken bir hata oluştu.')
    }
  }

  const handleEdit = async (categoryId) => {
    try {
      const token = localStorage.getItem('token')

      const formData = new FormData()
      formData.append('categoryId', categoryId)
      formData.append('name', name)
      formData.append('description', description)
      formData.append('icon', icon)
      formData.append('orderNumber', orderNumber)
      formData.append('imageHorizontal', imageHorizontal)
      formData.append('imageSquare', imageSquare)

      const response = await axios.put(`${API_BASE_URL}/category/${categoryId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      setCategories(
        categories.map((category) =>
          category.categoryId === categoryId ? response.data : category,
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

  const handleEditSubCategoryModalOpen = async (categoryId, subCategoryId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${API_BASE_URL}/category/${categoryId}/subcategory/${subCategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      const subCategoryToEdit = response.data
      setEditSubCategoryId(subCategoryId)
      setName(subCategoryToEdit.name || '')
      setDescription(subCategoryToEdit.description || '')
      setIcon(subCategoryToEdit.icon || '')
      setOrderNumber(subCategoryToEdit.orderNumber || '')
      setVisible3(true)
    } catch (error) {
      console.error(error)
      toast.error('Alt kategori bilgileri getirilirken bir hata oluştu.')
    }
  }

  return (
    <>
      <ToastContainer />
      <CModal
        visible={visible2}
        onClose={() => setVisible2(false)}
        aria-labelledby="EditCategoryModalLabel"
      >
        <CModalHeader>
          <CModalTitle id="EditCategoryModalLabel">Kategori Düzenle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="mt-3">
            <CFormInput
              type="text"
              id="editCategoryName"
              label="Kategori Adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <CFormInput
              type="text"
              id="editDescription"
              label="Açıklama"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <CFormInput
              type="file"
              id="editIcon"
              label="İkon"
              onChange={(e) => setIcon(e.target.files[0])}
            />
            <CFormInput
              type="number"
              id="editOrderNumber"
              label="Sıra No"
              value={orderNumber}
              onChange={(e) => setOrderNumber(parseInt(e.target.value))}
            />
            <CFormInput
              type="file"
              id="editImageHorizontal"
              label="Web Görsel"
              onChange={(e) => setImageHorizontal(e.target.files[0])}
            />
            <CFormInput
              type="file"
              id="editImageSquare"
              label="Mobil Görsel"
              onChange={(e) => setImageSquare(e.target.files[0])}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => handleEdit(editCategoryId)}>
            Güncelle
          </CButton>
        </CModalFooter>
      </CModal>

      <CButton color="primary" className="mb-3" onClick={() => setVisible(!visible)}>
        Yeni Kategori Ekle
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
          <CForm className="mt-3">
            <CFormInput
              type="text"
              id="categoryName"
              label="Yeni Kategori Adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <CFormInput
              type="text"
              id="description"
              label="Açıklama"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <CFormInput
              type="file"
              id="icon"
              label="İkon"
              onChange={(e) => setIcon(e.target.files[0])}
            />
            <CFormInput
              type="number"
              id="orderNumber"
              label="Sıra No"
              value={orderNumber}
              onChange={(e) => setOrderNumber(parseInt(e.target.value))}
            />
            <CFormInput
              type="file"
              id="imageHorizontal"
              label="Web Görsel"
              onChange={(e) => setImageHorizontal(e.target.files[0])}
            />
            <CFormInput
              type="file"
              id="imageSquare"
              label="Mobil Görsel"
              onChange={(e) => setImageSquare(e.target.files[0])}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={newCategory}>
            Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal
        visible={visible4}
        onClose={() => setVisible4(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Yeni Alt Kategori Ekle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="mt-3">
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              label="Yeni Alt Kategori Adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </CForm>
          <CForm className="mt-3">
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              label="Açıklama"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </CForm>
          <CForm className="mt-3">
            <CFormInput
              type="text"
              id="exampleFormControlInput1"
              label="İkon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </CForm>
          <CForm className="mt-3">
            <CFormInput
              type="number"
              id="exampleFormControlInput1"
              label="Sıra No"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={newSubCategory}>
            Kaydet
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        visible={visible3}
        onClose={() => setVisible3(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Alt Kategori Düzenle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="mt-3">
            <CFormInput
              type="text"
              id="name"
              label="Alt Kategori Adı"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <CFormInput
              type="text"
              id="name"
              label="Açıklama"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <CFormInput
              type="file"
              id="icon"
              label="İkon"
              onChange={(e) => setIcon(e.target.files[0])}
            />
            <CFormInput
              type="number"
              id="orderNumber"
              label="Sıra No"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </CForm>
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible3(false)}>
            Kapat
          </CButton>
          <CButton
            color="primary"
            onClick={() => editSubCategory(parentCategoryId, editSubCategoryId)} // Corrected parentCategoryId and editSubCategoryId parameters
          >
            Değişiklikleri Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Kategori Adı</CTableHeaderCell>
            <CTableHeaderCell scope="col">Eylemler</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {categories.map((category, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{category.name}</CTableDataCell>
              <CTableDataCell>
                <CButton
                  color="primary"
                  className="me-2"
                  onClick={() => categoryEdit(category.categoryId)}
                >
                  Düzenle
                </CButton>
                <CButton
                  color="danger text-white"
                  className="me-2"
                  onClick={() => handleDelete(category.categoryId)}
                >
                  Sil
                </CButton>
                <CButton
                  color="info text-white"
                  onClick={() => handleSubCategoryEdit(category.categoryId)}
                >
                  Alt Kategori Ekle
                </CButton>
                <CButton
                  color="success text-white"
                  className="ms-2"
                  onClick={() => {
                    setParentCategoryId(category.categoryId)
                    if (category.subCategories && category.subCategories.length > 0) {
                      setSelectedCategoryId(category.categoryId)
                    } else {
                      toast.info('Alt kategori verisi bulunmamaktadır')
                    }
                  }}
                >
                  Alt Kategorileri Göster
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
      {selectedCategoryId && subCategories.length > 0 && (
        <>
          <h3>Alt Kategoriler</h3>
          <CTable>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">Alt Kategori Adı</CTableHeaderCell>
                <CTableHeaderCell scope="col">Eylemler</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {subCategories.map((subCategory, index) => (
                <CTableRow key={index}>
                  <CTableDataCell>{subCategory.name}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="primary"
                      className="me-2"
                      onClick={() =>
                        handleEditSubCategoryModalOpen(
                          selectedCategoryId,
                          subCategory.subCategoryId,
                        )
                      }
                    >
                      Düzenle
                    </CButton>
                    <CButton
                      color="danger text-white"
                      onClick={() => handleSubCategoryDelete(subCategory.subCategoryId)}
                    >
                      Sil
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </>
      )}
    </>
  )
}

export default Categories
