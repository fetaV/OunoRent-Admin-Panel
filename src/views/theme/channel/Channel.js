import React, { useState, useEffect } from "react";
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
  CFormSwitch,
  CPagination,
  CPaginationItem,
} from "@coreui/react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../../../../config";

const Channel = () => {
  const [channel, setChannel] = useState([]);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [newChannel, setNewChannel] = useState({
    name: "",
    text: "",
    orderNumber: 0,
    isActive: false,
  });
  const [visible, setVisible] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChannel, setFilteredChannel] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filteredData = channel
      .filter(
        (channel) =>
          channel.name && channel.name.toLowerCase().includes(lowercasedQuery)
      )
      .sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1));
    setFilteredChannel(filteredData);
  }, [searchQuery, channel]);

  useEffect(() => {
    fetchChannel();
  }, []);

  const fetchChannel = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Channel`);
      console.log(response);
      setChannel(response.data);
    } catch (error) {
      console.error("getChannel error:", error);
      toast.error("Failed to fetch channel items");
    }
  };

  const handleCreateChannel = async () => {
    const formData = new FormData();
    formData.append("Name", newChannel.name);
    formData.append("Logo", logoFile);
    formData.append("IsActive", newChannel.isActive);

    try {
      const response = await axios.post(`${API_BASE_URL}/Channel`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Channel item created successfully");
      fetchChannel();
      setVisible(false);
    } catch (error) {
      console.error("createChannel error:", error);
      toast.error("Failed to create channel item");
    }
  };

  const handleUpdateChannel = async (channelId) => {
    const formData = new FormData();
    formData.append("ChannelId", channelId);
    formData.append("Name", currentChannel.name);
    if (logoFile) {
      formData.append("Logo", logoFile);
    }
    formData.append("IsActive", currentChannel.isActive);
    console.log(currentChannel.name, logoFile, currentChannel.isActive);

    try {
      await axios.put(`${API_BASE_URL}/Channel/${channelId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Channel item updated successfully");
      fetchChannel();
      setVisible(false);
    } catch (error) {
      console.error("updateChannel error:", error);
      toast.error("Failed to update channel item");
    }
  };

  const handleDeleteChannel = async (channelId) => {
    try {
      await axios.delete(`${API_BASE_URL}/Channel/${channelId}`);
      toast.success("Channel item deleted successfully");
      fetchChannel();
    } catch (error) {
      console.error("deleteChannel error:", error);
      toast.error("Failed to delete channel item");
    }
  };

  const handleEditButtonClick = async (channelId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Channel/${channelId}`);
      setCurrentChannel(response.data);
      setVisible(true);
    } catch (error) {
      console.error("Error fetching the channel item:", error);
      toast.error("Failed to fetch channel item");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredChannel.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredChannel.length / itemsPerPage);

  return (
    <div>
      <ToastContainer />
      <CButton
        color="primary"
        className="mb-3"
        onClick={() => setVisible(true)}
      >
        Yeni Kanal Ekle
      </CButton>

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
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              İsim
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Logo
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Durum
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Eylemler
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((item) => (
            <CTableRow key={item.channelId}>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {item.name}
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <img
                  src={`http://188.132.178.191:5244/${item.logo}`}
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
                  }}
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
                  onClick={() => handleEditButtonClick(item.channelId)}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDeleteChannel(item.channelId)}
                >
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

      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>
            {currentChannel ? "Edit Channel Item" : "Create Channel Item"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              className="mb-3"
              label="Soru Başlığı"
              value={currentChannel ? currentChannel.name : newChannel.name}
              onChange={(e) =>
                currentChannel
                  ? setCurrentChannel({
                      ...currentChannel,
                      name: e.target.value,
                    })
                  : setNewChannel({ ...newChannel, name: e.target.value })
              }
            />
            {currentChannel && currentChannel.logo && (
              <div>
                <label>Mevcut Logo</label>
                <img
                  src={`http://188.132.178.191:5244/${currentChannel.logo}`}
                  alt="Mobil Resim"
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
              label="Logo"
              onChange={(e) => setLogoFile(e.target.files[0])}
            />
            <CFormSwitch
              id="isActive"
              label={
                currentChannel
                  ? currentChannel.isActive
                    ? "Aktif"
                    : "Pasif"
                  : newChannel.isActive
                    ? "Aktif"
                    : "Pasif"
              }
              checked={
                currentChannel ? currentChannel.isActive : newChannel.isActive
              }
              onChange={(e) =>
                currentChannel
                  ? setCurrentChannel({
                      ...currentChannel,
                      isActive: e.target.checked,
                    })
                  : setNewChannel({ ...newBrand, isActive: e.target.checked })
              }
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Kapat
          </CButton>
          <CButton
            color="primary"
            onClick={() =>
              currentChannel
                ? handleUpdateChannel(currentChannel.channelId)
                : handleCreateChannel()
            }
          >
            {currentChannel ? "Save Changes" : "Create"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Channel;
