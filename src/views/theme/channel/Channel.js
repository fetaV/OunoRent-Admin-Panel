import React, { useEffect, useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilPencil, cilTrash } from "@coreui/icons";
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
    currentChannel: null,
    visible: false,
    logo: null,
    searchQuery: "",
    editChannelId: null,
    filteredChannel: [],
    editChannelData: {},
    currentPage: 1,
    isActive: true,
  });

  const itemsPerPage = 10;

  useEffect(() => {
    const loadChannel = async () => {
      const [channel] = await Promise.all([fetchChannel()]);
      setState((prevState) => ({
        ...prevState,
        channel: channel,
        filteredChannel: channel,
      }));
    };
    loadChannel();
  }, []);

  const handleModalOpen = async (formId = null) => {
    if (formId) {
      const data = await fetchChannelForID(formId);
      setState((prevState) => ({
        ...prevState,
        editChannelData: {
          channelId: data.channelId || "",
          name: data.name || "",
          logo: data.logo || "",
          isActive: data.isActive || false,
        },
        editChannelId: formId,
        modalVisible: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        editChannelData: {
          channelId: "",
          name: "",
          logo: "",
          isActive: false,
        },
        editChannelId: null,
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { editChannelId, editChannelData } = state;

    const channelData = new FormData();
    channelData.append("ChannelId", editChannelId || "");
    channelData.append("Name", editChannelData.name);
    if (editChannelData.logo) {
      channelData.append("Logo", editChannelData.logo);
    }
    channelData.append("IsActive", Boolean(editChannelData.isActive));

    if (editChannelId) {
      await updateChannel(editChannelId, editChannelData);
      toast.success("Channel başarıyla güncellendi.");
    } else {
      await createChannel(channelData);
      toast.success("Channel başarıyla oluşturuldu.");
    }

    const updatedChannel = await fetchChannel();
    setState((prevState) => ({
      ...prevState,
      modalVisible: false,
      channel: updatedChannel,
      filteredChannel: updatedChannel,
    }));
  };

  const handleDelete = async (formId) => {
    await deleteChannel(formId);
    toast.success("Channel başarıyla silindi!");
    const updatedChannel = await fetchChannel();
    setState((prevState) => ({
      ...prevState,
      channel: updatedChannel,
      filteredChannel: updatedChannel,
    }));
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
  }, [state.searchQuery, state.channel]);

  const handleEdit = async () => {
    console.log("11", state.editChannelData);
    const { editChannelId, editChannelData } = state;

    const updatedData = new FormData();
    if (editChannelData.name) updatedData.append("Name", editChannelData.name);
    if (editChannelData.logo) updatedData.append("Logo", editChannelData.logo);
    if (editChannelData.isActive !== undefined)
      updatedData.append("IsActive", editChannelData.isActive);

    await updateChannel(editChannelId, updatedData);
    toast.success("Channel başarıyla güncellendi.");

    const updatedChannel = await updateChannel();
    setState((prevState) => ({
      ...prevState,
      channel: updatedChannel,
      filteredChannel: updatedChannel,
      modalVisible: false,
    }));
  };

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredChannel.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleToggleActive = async (channelId, currentStatus) => {
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

  return (
    <div>
      <ToastContainer />
      <CButton
        color="primary"
        className="mb-3"
        onClick={() => handleModalOpen()}
      >
        Yeni Channel Ekle
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
            {["İsim", "Logo", "Durum", "Eylemler"].map((header) => (
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
                  src={`http://10.10.3.181:5244/${item.logo}`}
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
                <div
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    backgroundColor: item.isActive ? "#d4edda" : "#f8d7da",
                    color: item.isActive ? "#155724" : "#721c24",
                    border: `1px solid ${item.isActive ? "#c3e6cb" : "#f5c6cb"}`,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    handleToggleActive(item.channelId, item.isActive)
                  }
                >
                  {item.isActive ? "Aktif" : "Pasif"}
                </div>
              </CTableDataCell>

              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
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
                  onClick={() => handleDelete(item.channelId)}
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
            {state.editChannelId ? "Channel Düzenle" : "Yeni Channel Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              className="mb-3"
              label="Channel İsmi"
              value={state.editChannelData.name}
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  editChannelData: {
                    ...prevState.editChannelData,
                    name: e.target.value,
                  },
                }))
              }
            />
            {state.editChannelData.logo && (
              <div className="mb-3">
                <label>Mevcut Logo</label>
                <img
                  src={`http://10.10.3.181:5244/${state.editChannelData.logo}`}
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
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  editChannelData: {
                    ...prevState.editChannelData,
                    logo: e.target.files[0],
                  },
                }))
              }
            />
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
    </div>
  );
};

export default Channel;
