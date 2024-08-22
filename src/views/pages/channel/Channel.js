import React, { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash, cilCheckCircle, cilXCircle } from "@coreui/icons";
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
  CPagination,
  CPaginationItem,
  CFormSwitch,
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createChannel,
  deleteChannel,
  fetchChannel,
  fetchChannelForID,
  updateChannel,
} from "src/api/useApi";

const Channel = () => {
  const [state, setState] = useState({
    channel: [],
    modalVisible: false,
    logo: null,
    deleteChannelId: null,
    searchQuery: "",
    editChannelId: null,
    filteredChannel: [],
    channelData: {},
    currentPage: 1,
    deleteModalVisible: false,
  });

  const itemsPerPage = 10;

  const loadChannel = async () => {
    const [channel] = await Promise.all([fetchChannel()]);
    setState((prevState) => ({
      ...prevState,
      channel,
      filteredChannel: channel,
      modalVisible: false,
    }));
  };

  useEffect(() => {
    loadChannel();
  }, []);

  const handleModalOpen = async (formId = null) => {
    console.log("asddasdasad");
    if (formId) {
      const data = await fetchChannelForID(formId);
      setState((prevState) => ({
        ...prevState,
        channelData: data,
        editChannelId: formId,
        modalVisible: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        channelData: {
          isActive: true,
          name: "",
          logo: "",
        },
        editChannelId: null,
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { editChannelId, channelData } = state;

    if (editChannelId) {
      console.log("here1", editChannelId, channelData);
      await updateChannel(editChannelId, channelData);
      toast.success("Channel başarıyla güncellendi.");
    } else {
      console.log("here2", editChannelId, channelData);
      await createChannel(channelData);
      toast.success("Channel başarıyla oluşturuldu.");
    }

    loadChannel();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setState((prevState) => ({
          ...prevState,
          channelData: { ...prevState.channelData, logo: reader.result },
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const filterChannel = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.channel.filter((item) => {
        const name = item.name ? item.name.toLowerCase() : "";

        return [name].some((value) => value.includes(lowercasedQuery));
      });

      setState((prevState) => ({
        ...prevState,
        filteredChannel: filteredData,
      }));
    };

    filterChannel();
  }, [state.searchQuery]);

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredChannel.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleToggleActive = async (channelId, currentStatus) => {
    console.log("here10");
    const updatedChannel = {
      ...state.channel.find((item) => item.channelId === channelId),
      isActive: !currentStatus,
    };

    await updateChannel(channelId, updatedChannel);

    toast.success("Channel durumu başarıyla güncellendi.");

    const updatedChannelList = await fetchChannel();

    setState((prevState) => ({
      ...prevState,
      channel: updatedChannelList,
      filteredChannel: updatedChannelList,
    }));
  };

  const handleDeleteClick = (formId) => {
    setState((prevState) => ({
      ...prevState,
      deleteChannelId: formId,
      deleteModalVisible: true,
    }));
  };

  const confirmDelete = async () => {
    await deleteChannel(state.deleteChannelId);
    toast.success("Channel başarıyla silindi!");
    const updatedChannel = await fetchChannel();
    setState((prevState) => ({
      ...prevState,
      channel: updatedChannel,
      filteredChannel: updatedChannel,
      deleteModalVisible: false,
      deleteChannelId: null,
    }));
  };

  return (
    <div>
      <ToastContainer />
      <CButton
        color="primary"
        className="mb-3"
        onClick={() => handleModalOpen()}
      >
        Yeni Kanal Ekle
      </CButton>
      <CFormInput
        type="text"
        id="search"
        placeholder="Arama"
        value={state.searchQuery}
        onChange={(e) =>
          setState((prevState) => ({
            ...prevState,
            searchQuery: e.target.value,
          }))
        }
      />

      <CTable>
        <CTableHead>
          <CTableRow style={{ textAlign: "center", verticalAlign: "middle" }}>
            {["İsim", "Logo", "Eylemler"].map((header) => (
              <CTableHeaderCell key={header}>{header}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((item) => (
            <CTableRow key={item.channelId}>
              {["name"].map((key) => (
                <CTableDataCell
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                  key={key}
                >
                  {item[key]}
                </CTableDataCell>
              ))}
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <img
                  src={`http://10.10.3.181:5244/${item.logoUrl}`}
                  alt="Mobil Resim"
                  style={{
                    width: "50px",
                    Height: "auto",
                  }}
                />
              </CTableDataCell>

              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  className={`text-white me-2 ${item.isActive ? "btn-success" : "btn-danger"}`}
                  onClick={() =>
                    handleToggleActive(item.channelId, item.isActive)
                  }
                >
                  {item.isActive ? (
                    <CIcon icon={cilCheckCircle} />
                  ) : (
                    <CIcon icon={cilXCircle} />
                  )}
                </CButton>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => {
                    handleModalOpen(item.channelId);
                  }}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDeleteClick(item.channelId)}
                >
                  <CIcon icon={cilTrash} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CPagination className="btn btn-sm">
        {Array.from(
          { length: Math.ceil(state.filteredChannel.length / itemsPerPage) },
          (_, i) => (
            <CPaginationItem
              key={i + 1}
              active={i + 1 === state.currentPage}
              onClick={() =>
                setState((prevState) => ({ ...prevState, currentPage: i + 1 }))
              }
            >
              {i + 1}
            </CPaginationItem>
          )
        )}
      </CPagination>

      <CModal
        visible={state.modalVisible}
        onClose={() =>
          setState((prevState) => ({ ...prevState, modalVisible: false }))
        }
        aria-labelledby="ModalLabel"
      >
        <CModalHeader>
          <CModalTitle id="ModalLabel">
            {state.editChannelId ? "Kanal Düzenle" : "Yeni Kanal Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              className="mb-3"
              label="Kanal İsmi"
              value={state.channelData.name}
              onChange={(e) =>
                setState({
                  ...state,
                  channelData: { ...state.channelData, name: e.target.value },
                })
              }
            />
            {state.channelData.logo && (
              <div className="mb-3">
                <label>Mevcut Logo</label>
                <img
                  src={
                    state.channelData.logo.startsWith("data:image")
                      ? state.channelData.logo
                      : `http://10.10.3.181:5244/${state.channelData.logo}`
                  }
                  alt="Logo"
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </div>
            )}

            <CFormInput
              type="file"
              className="mb-3"
              label="Logo Yükle"
              onChange={handleFileChange}
            />
            {state.editChannelId === null && (
              <CFormSwitch
                id="isActive"
                label={state.channelData.isActive ? "Aktif" : "Pasif"}
                checked={state.channelData.isActive}
                onChange={(e) =>
                  setState({
                    ...state,
                    channelData: {
                      ...state.channelData,
                      isActive: e.target.checked,
                    },
                  })
                }
              />
            )}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() =>
              setState((prevState) => ({ ...prevState, modalVisible: false }))
            }
          >
            Kapat
          </CButton>
          <CButton color="primary" onClick={handleSave}>
            {state.editChannelId ? "Güncelle" : "Kaydet"}
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        alignment="center"
        visible={state.deleteModalVisible}
        onClose={() =>
          setState((prevState) => ({
            ...prevState,
            deleteModalVisible: false,
            deleteChannelId: null,
          }))
        }
      >
        <CModalHeader>
          <CModalTitle>Bu Kanalı silmek istediğinize emin misiniz?</CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                deleteModalVisible: false,
                deleteChannelId: null,
              }))
            }
          >
            İptal
          </CButton>
          <CButton color="danger text-white" onClick={confirmDelete}>
            Sil
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Channel;
