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
} from '@coreui/react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import API_BASE_URL from '../../../../config'

const Slider = () => {
  const [sliders, setSliders] = useState([])
  const [title, setTitle] = useState('')
  const [mainImageUrl, setMainImageUrl] = useState('')
  const [mobileImageUrl, setMobileImageUrl] = useState('')
  const [targetUrl, setTargetUrl] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [duration, setDuration] = useState('')
  const [activeFrom, setActiveFrom] = useState('')
  const [activeTo, setActiveTo] = useState('')
  const [isActive, setIsActive] = useState(false)
  const [mainImage, setMainImage] = useState(null)
  const [mobileImage, setMobileImage] = useState(null)
  const [editSliderId, setEditSliderId] = useState(null)
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)

  const handleSubmit = async (e) => {
    const token = localStorage.getItem('token')
    e.preventDefault()

    const formatToUTC = (dateStr) => {
      const date = new Date(dateStr)
      return date.toISOString()
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('targetUrl', targetUrl)
    formData.append('orderNumber', orderNumber)
    formData.append('duration', duration)
    formData.append('activeFrom', formatToUTC(activeFrom))
    formData.append('activeTo', formatToUTC(activeTo))
    formData.append('isActive', isActive)
    if (mainImage) {
      formData.append('mainImage', mainImage)
    }
    if (mobileImage) {
      formData.append('mobileImage', mobileImage)
    }

    try {
      await axios.post(`${API_BASE_URL}/Slider`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Slider successfully added!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setVisible(false)
    } catch (error) {
      console.error(error)
      toast.error('Failed to add slider')
    }
  }

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${API_BASE_URL}/Slider`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        console.log(response)
        setSliders(response.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchSliders()
  }, [])

  const handleDelete = async (sliderId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`${API_BASE_URL}/slider/${sliderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setSliders(sliders.filter((slider) => slider.sliderId !== sliderId))
      toast.success('Slider başarıyla silindi!')
    } catch (error) {
      console.error(error.response.data)
      toast.error('Slider silinirken bir hata oluştu!')
    }
  }

  const handleEditModalOpen = (sliderId) => {
    setEditSliderId(sliderId)
    const sliderToEdit = sliders.find((slider) => slider.sliderId === sliderId)
    setTitle(sliderToEdit.title)
    setMainImageUrl(sliderToEdit.mainImageUrl)
    setTargetUrl(sliderToEdit.targetUrl)
    setOrderNumber(sliderToEdit.orderNumber)
    setDuration(sliderToEdit.duration)
    setActiveFrom(sliderToEdit.activeFrom)
    setActiveTo(sliderToEdit.activeTo)
    setIsActive(sliderToEdit.isActive)
    setMobileImageUrl(sliderToEdit.mobileImageUrl)
    setVisible2(true)
  }

  const handleEdit = async (sliderId) => {
    const formatToUTC = (dateStr) => {
      const date = new Date(dateStr)
      return date.toISOString()
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('sliderId', sliderId)
    formData.append('targetUrl', targetUrl)
    formData.append('orderNumber', orderNumber)
    formData.append('duration', duration)
    formData.append('activeFrom', formatToUTC(activeFrom))
    formData.append('activeTo', formatToUTC(activeTo))
    formData.append('isActive', isActive)
    if (mainImage) {
      formData.append('mainImage', mainImage)
    }
    if (mobileImage) {
      formData.append('mobileImage', mobileImage)
    }

    try {
      const token = localStorage.getItem('token')
      await axios.put(`${API_BASE_URL}/Slider/${sliderId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Slider başarıyla güncellendi!')
      setInterval(() => {
        window.location.reload()
      }, 500)
      setVisible2(false)
    } catch (error) {
      console.error('Error response:', error.response)
      if (error.response && error.response.status === 409) {
        toast.error('Çakışma: Slider ID mevcut veya veri çakışması oluştu.')
      } else {
        toast.error('Slider güncellenirken bir hata oluştu')
      }
    }
  }

  return (
    <>
      <ToastContainer />
      <CButton color="primary" className="mb-3" onClick={() => setVisible(true)}>
        Yeni Slider Ekle
      </CButton>
      <CModal
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader>
          <CModalTitle id="LiveDemoExampleLabel">Yeni Slider Ekle</CModalTitle>
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
              type="file"
              id="mainImage"
              label="Ana Resim"
              onChange={(e) => setMainImage(e.target.files[0])}
            />
            <CFormInput
              type="file"
              id="mobileImage"
              label="Mobil Resim"
              onChange={(e) => setMobileImage(e.target.files[0])}
            />
            <CFormInput
              type="text"
              id="targetUrl"
              label="Hedef URL"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
            />
            <CFormInput
              type="number"
              id="orderNumber"
              label="Sıra Numarası"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
            <CFormInput
              type="number"
              id="duration"
              label="Süre"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <CFormInput
              type="datetime-local"
              id="activeFrom"
              label="Aktif Başlangıç"
              value={activeFrom ? new Date(activeFrom).toISOString().slice(0, 16) : ''}
              onChange={(e) => setActiveFrom(e.target.value)}
            />
            <CFormInput
              type="datetime-local"
              id="activeTo"
              label="Aktif Bitiş"
              value={activeTo ? new Date(activeTo).toISOString().slice(0, 16) : ''}
              onChange={(e) => setActiveTo(e.target.value)}
            />
            <CFormSwitch
              id="isActive"
              label="Aktif"
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
          <CModalTitle id="LiveDemoExampleLabel2">Slider Düzenle</CModalTitle>
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

            {mainImageUrl && (
              <div>
                <label>Mevcut Ana Resim:</label>
                <img
                  src={`http://10.10.3.181:5244/${mainImageUrl}`}
                  alt="Ana Resim"
                  style={{
                    width: '100%',
                    maxHeight: '100px',
                    display: 'block',
                    margin: '0 auto',
                  }}
                />
              </div>
            )}
            <CFormInput
              type="file"
              id="mainImage"
              label="Ana Resim"
              onChange={(e) => setMainImage(e.target.files[0])}
            />

            {mobileImageUrl && (
              <div>
                <label>Mevcut Mobil Resim:</label>
                <img
                  src={`http://10.10.3.181:5244/${mobileImageUrl}`}
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
              id="mobileImage"
              label="Mobil Resim"
              onChange={(e) => setMobileImage(e.target.files[0])}
            />

            <CFormInput
              type="text"
              id="targetUrl"
              label="Hedef URL"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
            />
            <CFormInput
              type="number"
              id="orderNumber"
              label="Sıra Numarası"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
            <CFormInput
              type="number"
              id="duration"
              label="Süre"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <CFormInput
              type="datetime-local"
              id="activeFrom"
              label="Aktif Başlangıç"
              value={activeFrom ? new Date(activeFrom).toISOString().slice(0, 16) : ''}
              onChange={(e) => setActiveFrom(e.target.value)}
            />
            <CFormInput
              type="datetime-local"
              id="activeTo"
              label="Aktif Bitiş"
              value={activeTo ? new Date(activeTo).toISOString().slice(0, 16) : ''}
              onChange={(e) => setActiveTo(e.target.value)}
            />
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
          <CButton color="primary" onClick={() => handleEdit(editSliderId)}>
            Değişiklikleri Kaydet
          </CButton>
        </CModalFooter>
      </CModal>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Başlık
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Hedef URL
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Başlangıç Tarihi
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Bitiş Tarihi
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Ekranda Durma Süresi
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Web Resim
            </CTableHeaderCell>
            <CTableHeaderCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
              Mobil Resim
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
          {sliders.map((slider) => {
            const activeFrom = new Date(slider.activeFrom).toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })
            const activeTo = new Date(slider.activeTo).toLocaleDateString('tr-TR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })

            return (
              <CTableRow key={slider.sliderId}>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {slider.title}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {slider.targetUrl}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {activeFrom}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {activeTo}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {slider.duration}
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  <img
                    src={`http://10.10.3.181:5244/${slider.mainImageUrl}`}
                    alt="Mobil Resim"
                    style={{
                      width: '100px',
                      Height: 'auto',
                    }}
                  />
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                      src={`http://10.10.3.181:5244/${slider.mobileImageUrl}`}
                      alt="Küçük Resim"
                      style={{
                        width: '50px',
                        height: 'auto',
                      }}
                    />
                  </div>
                </CTableDataCell>
                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  {slider.isActive ? 'Aktif' : 'Pasif'}
                </CTableDataCell>

                <CTableDataCell style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  <CButton
                    color="primary"
                    className="me-2"
                    onClick={() => handleEditModalOpen(slider.sliderId)}
                  >
                    Düzenle
                  </CButton>
                  <CButton color="danger text-white" onClick={() => handleDelete(slider.sliderId)}>
                    Sil
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            )
          })}
        </CTableBody>
      </CTable>
    </>
  )
}

export default Slider
