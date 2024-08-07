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
  const [tc, setTc] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [gender, setGender] = useState('')
  const [address, setAddress] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [editUserId, setEditUserId] = useState(null)
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        email,
        password,
        passwordConfirm,
      })
      setUsers([...users, response.data])
      setEmail('')
      setPassword('')
      setPasswordConfirm('')
      setVisible(false)
      toast.success('Başarıyla Kayıt İşleminiz Gerçekleşti!')
      window.location.reload()
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
      setUsers(users.filter((user) => user._id !== id))
      toast.success('User deleted successfully!')
    } catch (error) {
      console.error(error.response.data)
    }
  }

  const handleEditModalOpen = (id) => {
    setEditUserId(id)
    setVisible2(true)

    const userToEdit = users.find((user) => user.id === id)
    if (userToEdit) {
      const formattedDate = new Date(userToEdit.birthDate).toISOString().split('T')[0]
      setName(userToEdit.name || '')
      setSurname(userToEdit.surname || '')
      setEmail(userToEdit.email || '')
      setPhoneNumber(userToEdit.phoneNumber || '')
      setTc(userToEdit.tc || '')
      setBirthDate(formattedDate)
      setGender(userToEdit.gender || '')
      setAddress(userToEdit.address || '')
    }
  }

  const handleEdit = async (userId) => {
    try {
      const token = localStorage.getItem('token')
      const utcBirthDate = new Date(birthDate).toISOString()
      const response = await axios.put(
        `${API_BASE_URL}/user/${userId}`,
        {
          id: userId,
          name,
          surname,
          email,
          phoneNumber,
          address,
          tc,
          gender,
          birthDate: utcBirthDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      toast.success('User updated successfully!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setVisible2(false)
      console.log('User information:', response.data)
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
                    type="text"
                    id="exampleFormControlInput1"
                    label="Telefon Numarası"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </CForm>
              </CCol>
              <CCol>
                <CForm>
                  <CFormInput
                    type="text"
                    id="exampleFormControlInput1"
                    label="TC No"
                    value={tc}
                    onChange={(e) => setTc(e.target.value)}
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
              </CCol>
              <CCol>
                <CForm>
                  <CFormInput
                    type="text"
                    id="exampleFormControlInput1"
                    label="Cinsiyet"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  />
                </CForm>
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
              TC No
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Doğum Tarihi
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Cinsiyet
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
          {users.map((user, index) => {
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
                  {user.tc}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {formattedDate}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {user.gender}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {user.address}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {' '}
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleEditModalOpen(user.id)}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal2"
                  >
                    Düzenle
                  </button>
                  <button className="btn btn-danger mr-2" onClick={() => handleDelete(user.id)}>
                    Sil
                  </button>
                </CTableDataCell>
              </CTableRow>
            )
          })}
        </CTableBody>
      </CTable>
    </>
  )
}

export default Typography
