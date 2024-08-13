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
  CContainer,
  CRow,
  CCol,
  CFormTextarea,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from '../../../../config'

const Typography = () => {
  const [users, setUsers] = useState([])
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [editUserId, setEditUserId] = useState(null)
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredFooter, setFilteredFooter] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
        passwordConfirm,
      })

      setEmail('')
      setPassword('')
      setPasswordConfirm('')
      setVisible(false)
      toast.success('Başarıyla Kayıt İşleminiz Gerçekleşti!')
      setInterval(() => {
        window.location.reload()
      }, 500)
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

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase()
    const filteredData = users
      .filter(
        (user) =>
          (user.address && user.address.toLowerCase().includes(lowercasedQuery)) ||
          (user.email && user.email.toLowerCase().includes(lowercasedQuery)) ||
          (user.name && user.name.toString().toLowerCase().includes(lowercasedQuery)) ||
          (user.surname && user.surname.toString().toLowerCase().includes(lowercasedQuery)),
      )
      .sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1))
    setFilteredFooter(filteredData)
  }, [searchQuery, users])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(response.data)
        setUsers(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchUsers()
  }, [])

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== id))
      toast.success('Kullanıcı başarıyla silindi!')
    } catch (error) {
      console.error(error.response.data)
      toast.error('Bir hata oluştu.')
    }
  }

  const handleEditModalOpen = (userId) => {
    console.log(userId)
    const userToEdit = users.find((user) => user.userId === userId)
    if (userToEdit) {
      const formattedDate = new Date(userToEdit.birthDate).toISOString().split('T')[0]
      setName(userToEdit.name || '')
      setSurname(userToEdit.surname || '')
      setEmail(userToEdit.email || '')
      setPhoneNumber(userToEdit.phoneNumber || '')
      setBirthDate(formattedDate)
      setAddress(userToEdit.address || '')
      setEditUserId(userId)
      setVisible2(true)
    } else {
      toast.error('Kullanıcı bulunamadı.')
    }
  }

  const handleEdit = async (userId) => {
    try {
      const token = localStorage.getItem('token')
      const utcBirthDate = new Date(birthDate).toISOString()
      const response = await axios.put(
        `${API_BASE_URL}/user/${userId}`,
        {
          userId,
          name,
          surname,
          email,
          phoneNumber,
          address,
          birthDate: utcBirthDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      console.log({
        userId,
        name,
        surname,
        email,
        phoneNumber,
        address,
        birthDate: utcBirthDate,
      })
      setUsers((prevUsers) => prevUsers.map((user) => (user._id === userId ? response.data : user)))
      toast.success('Kullanıcı başarıyla güncellendi!')
      setVisible2(false)
    } catch (error) {
      if (error.response && error.response.data.errors) {
        const errorMessage = Object.values(error.response.data.errors).flat().join(' ')
        toast.error(errorMessage)
      } else if (error.response && error.response.data) {
        const errorMessages = Object.values(error.response.data).flat().join('')
        toast.error(errorMessages)
      } else {
        toast.error('Bir hata oluştu.')
      }
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredFooter.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredFooter.length / itemsPerPage)

  return (
    <>
      <ToastContainer />
      <CModal
        visible={visible2}
        onClose={() => setVisible2(false)}
        aria-labelledby="LiveDemoExampleLabel2"
      >
        <CModalHeader>
          <CModalTitle>Kullanıcı Düzenle</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CContainer>
            <CRow>
              <CCol>
                <CForm>
                  <CFormInput
                    type="text"
                    id="exampleFormControlInput1"
                    label="İsim"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </CForm>
              </CCol>
              <CCol>
                <CForm>
                  <CFormInput
                    type="text"
                    id="exampleFormControlInput1"
                    label="Soyisim"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </CForm>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormInput
                    type="text"
                    id="exampleFormControlInput1"
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </CForm>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormInput
                    type="date"
                    id="exampleFormControlInput1"
                    label="Doğum Tarihi"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </CForm>
                <CCol>
                  <CForm>
                    <CFormInput
                      type="text"
                      id="exampleFormControlInput1"
                      label="Telefon Numarası"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </CForm>
                </CCol>
              </CCol>
            </CRow>
            <CRow className="mt-3">
              <CCol>
                <CForm>
                  <CFormTextarea
                    type="text"
                    id="exampleFormControlInput1"
                    label="Adres"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </CForm>
              </CCol>
            </CRow>
          </CContainer>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible2(false)}>
            Kapat
          </CButton>
          <CButton color="primary" onClick={() => handleEdit(editUserId)}>
            Değişiklikleri Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

      <>
        <CButton color="primary" className="mb-3" onClick={() => setVisible(!visible)}>
          Yeni Kullanıcı Ekle
        </CButton>
        <CModal
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="LiveDemoExampleLabel"
        >
          <CModalHeader>
            <CModalTitle id="LiveDemoExampleLabel">Yeni Kullanıcı Ekle</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CFormInput
                type="text"
                id="exampleFormControlInput1"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </CForm>
            <CForm>
              <CFormInput
                type="text"
                id="exampleFormControlInput1"
                label="Parola"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </CForm>
            <CForm>
              <CFormInput
                type="text"
                id="exampleFormControlInput1"
                label="Tekrar Parola"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={handleSubmit}>
              Kaydet
            </CButton>
          </CModalFooter>
        </CModal>
      </>

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
              Soyisim
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Email
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Telefon
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Doğum Tarihi
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Adres
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Eylemler
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((user, index) => {
            const formattedDate = new Date(user.birthDate).toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
            return (
              <CTableRow key={index}>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {user.name}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {user.surname}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {user.email}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {user.phoneNumber}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {formattedDate}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {user.address}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {' '}
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleEditModalOpen(user.userId)}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal2"
                  >
                    Düzenle
                  </button>
                  <button
                    className="btn btn-danger text-white mr-2"
                    onClick={() => handleDelete(user.userId)}
                  >
                    Sil
                  </button>
                </CTableDataCell>
              </CTableRow>
            )
          })}
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

export default Typography
