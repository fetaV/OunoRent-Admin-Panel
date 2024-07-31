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
  const [editSliderId, setEditSliderId] = useState(null)
  const [visible, setVisible] = useState(false)
  const [visible2, setVisible2] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formatToUTC = (dateStr) => {
      const date = new Date(dateStr)
      return date.toISOString()
    }

    try {
      await axios.post(`${API_BASE_URL}/slider`, {
        title,
        mainImageUrl,
        mobileImageUrl,
        targetUrl,
        orderNumber,
        duration,
        activeFrom: formatToUTC(activeFrom),
        activeTo: formatToUTC(activeTo),
        isActive,
      })
      toast.success('Slider successfully added!')
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

    try {
      const token = localStorage.getItem('token')
      console.log('Sending request with data:', {
        sliderId,
        title,
        mainImageUrl,
        mobileImageUrl,
        targetUrl,
        orderNumber,
        duration,
        activeFrom: formatToUTC(activeFrom),
        activeTo: formatToUTC(activeTo),
        isActive,
      })
      await axios.put(
        `${API_BASE_URL}/Slider/${sliderId}`,
        {
          sliderId,
          title,
          mainImageUrl,
          mobileImageUrl,
          targetUrl,
          orderNumber,
          duration,
          activeFrom: formatToUTC(activeFrom),
          activeTo: formatToUTC(activeTo),
          isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      toast.success('Slider updated successfully!')
      setVisible2(false)
    } catch (error) {
      console.error('Error response:', error.response)
      if (error.response && error.response.status === 409) {
        toast.error('Conflict: Slider ID already exists or data conflict occurred.')
      } else {
        toast.error('Failed to update slider')
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
              type="text"
              id="mainImageUrl"
              label="Ana Resim URL"
              value={mainImageUrl}
              onChange={(e) => setMainImageUrl(e.target.value)}
            />
            <CFormInput
              type="text"
              id="mobileImageUrl"
              label="Mobil Resim URL"
              value={mobileImageUrl}
              onChange={(e) => setMobileImageUrl(e.target.value)}
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
            <CFormInput
              type="text"
              id="mainImageUrl"
              label="Ana Resim URL"
              value={mainImageUrl}
              onChange={(e) => setMainImageUrl(e.target.value)}
            />
            <CFormInput
              type="text"
              id="mobileImageUrl"
              label="Mobil Resim URL"
              value={mobileImageUrl}
              onChange={(e) => setMobileImageUrl(e.target.value)}
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
            <CTableHeaderCell scope="col">Başlık</CTableHeaderCell>
            <CTableHeaderCell scope="col">Hedef URL</CTableHeaderCell>
            <CTableHeaderCell scope="col">Başlangıç Tarihi</CTableHeaderCell>
            <CTableHeaderCell scope="col">Bitiş Tarihi</CTableHeaderCell>
            <CTableHeaderCell scope="col">Ekranda Durma Süresi</CTableHeaderCell>
            <CTableHeaderCell scope="col">Web Resim</CTableHeaderCell>
            <CTableHeaderCell scope="col">Mobil Resim</CTableHeaderCell>
            <CTableHeaderCell scope="col">Eylemler</CTableHeaderCell>
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
                <CTableHeaderCell>{slider.title}</CTableHeaderCell>
                <CTableDataCell>{slider.targetUrl}</CTableDataCell>
                <CTableDataCell>{activeFrom}</CTableDataCell>
                <CTableDataCell>{activeTo}</CTableDataCell>
                <CTableDataCell>{slider.duration}</CTableDataCell>
                <CTableDataCell>{slider.mainImageUrl}</CTableDataCell>
                <CTableDataCell>{slider.mobileImageUrl}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="primary"
                    className="me-2"
                    onClick={() => handleEditModalOpen(slider.sliderId)}
                  >
                    Düzenle
                  </CButton>
                  <CButton color="danger" onClick={() => handleDelete(slider.sliderId)}>
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
