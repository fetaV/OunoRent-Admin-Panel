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

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [activeMenuItems, setActiveMenuItems] = useState([]);
  const [currentMenuItem, setCurrentMenuItem] = useState(null);
  const [newMenuItem, setNewMenuItem] = useState({
    label: "",
    targetUrl: "",
    orderNumber: 0,
    onlyToMembers: false,
    isActive: false,
  });
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMenuItem, setFilteredMenuItem] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filteredData = menuItems
      .filter((menuItem) =>
        menuItem.label?.toLowerCase().includes(lowercasedQuery)
      )
      .sort((a, b) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1));
    setFilteredMenuItem(filteredData);
  }, [searchQuery, menuItems]);

  useEffect(() => {
    fetchMenuItems();
    fetchActiveMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/menuItem`);
      console.log("getMenuItems response:", response.data);
      setMenuItems(response.data);
      setFilteredMenuItem(response.data);
    } catch (error) {
      console.error("getMenuItems error:", error);
      toast.error("Failed to fetch menu items");
    }
  };

  const fetchActiveMenuItems = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/menuItem/GetActive`);
      console.log("getActiveMenuItems response:", response.data);
      setActiveMenuItems(response.data);
    } catch (error) {
      console.error("getActiveMenuItems error:", error);
      toast.error("Failed to fetch active menu items");
    }
  };

  const handleCreateMenuItem = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/menuItem`,
        newMenuItem
      );
      console.log("createMenuItem response:", response.data);
      toast.success("Menu item created successfully");
      setInterval(() => {
        window.location.reload();
      }, 500);
      fetchMenuItems();
      setVisible(false);
    } catch (error) {
      console.error("createMenuItem error:", error);
      toast.error("Failed to create menu item");
    }
  };

  const handleUpdateMenuItem = async (menuItemId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/menuItem/${menuItemId}`,
        currentMenuItem
      );
      console.log("updateMenuItem response:", response.data);
      toast.success("Menu item updated successfully");
      fetchMenuItems();
      setVisible(false);
    } catch (error) {
      console.error("updateMenuItem error:", error);
      toast.error("Failed to update menu item");
    }
  };

  const handleDeleteMenuItem = async (menuItemId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/menuItem/${menuItemId}`
      );
      console.log("deleteMenuItem response:", response.data);
      toast.success("Menu item deleted successfully");
      fetchMenuItems();
    } catch (error) {
      console.error("deleteMenuItem error:", error);
      toast.error("Failed to delete menu item");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMenuItem.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredMenuItem.length / itemsPerPage);

  return (
    <div>
      <ToastContainer />
      <CButton
        color="primary"
        className="mb-3"
        onClick={() => setVisible(true)}
      >
        Yeni Menü Ekle
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
              Menü Başlığı
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Sıra Numarası
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Hedef URL
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Durum
            </CTableHeaderCell>
            <CTableHeaderCell
              style={{ textAlign: "center", verticalAlign: "middle" }}
            >
              Kullanıcılara Özel
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
            <CTableRow key={item.menuItemId}>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {item.label}
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {item.orderNumber}
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {item.targetUrl}
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
                <div
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    backgroundColor: item.onlyToMembers ? "#d4edda" : "#f8d7da",
                    color: item.onlyToMembers ? "#155724" : "#721c24",
                    border: `1px solid ${item.onlyToMembers ? "#c3e6cb" : "#f5c6cb"}`,
                  }}
                >
                  {item.onlyToMembers ? "Aktif" : "Pasif"}
                </div>
              </CTableDataCell>
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => {
                    setCurrentMenuItem(item);
                    setVisible(true);
                  }}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDeleteMenuItem(item.menuItemId)}
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
            {currentMenuItem ? "Edit Menu Item" : "Create Menu Item"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormInput
              type="text"
              className="mb-3"
              placeholder="Label"
              label="Menü Başlığı"
              value={
                currentMenuItem ? currentMenuItem.label : newMenuItem.label
              }
              onChange={(e) =>
                currentMenuItem
                  ? setCurrentMenuItem({
                      ...currentMenuItem,
                      label: e.target.value,
                    })
                  : setNewMenuItem({ ...newMenuItem, label: e.target.value })
              }
            />
            <CFormInput
              type="text"
              className="mb-3"
              placeholder="Target URL"
              label="Hedef URL"
              value={
                currentMenuItem
                  ? currentMenuItem.targetUrl
                  : newMenuItem.targetUrl
              }
              onChange={(e) =>
                currentMenuItem
                  ? setCurrentMenuItem({
                      ...currentMenuItem,
                      targetUrl: e.target.value,
                    })
                  : setNewMenuItem({
                      ...newMenuItem,
                      targetUrl: e.target.value,
                    })
              }
            />
            <CFormInput
              type="number"
              className="mb-3"
              placeholder="Order Number"
              label="Sıra Numarası"
              value={
                currentMenuItem
                  ? currentMenuItem.orderNumber
                  : newMenuItem.orderNumber
              }
              onChange={(e) =>
                currentMenuItem
                  ? setCurrentMenuItem({
                      ...currentMenuItem,
                      orderNumber: +e.target.value,
                    })
                  : setNewMenuItem({
                      ...newMenuItem,
                      orderNumber: +e.target.value,
                    })
              }
            />
            <CFormSwitch
              label="Durum"
              checked={
                currentMenuItem
                  ? currentMenuItem.isActive
                  : newMenuItem.isActive
              }
              onChange={(e) =>
                currentMenuItem
                  ? setCurrentMenuItem({
                      ...currentMenuItem,
                      isActive: e.target.checked,
                    })
                  : setNewMenuItem({
                      ...newMenuItem,
                      isActive: e.target.checked,
                    })
              }
            />
            <CFormSwitch
              label="Kullanıcılara Özel"
              checked={
                currentMenuItem
                  ? currentMenuItem.onlyToMembers
                  : newMenuItem.onlyToMembers
              }
              onChange={(e) =>
                currentMenuItem
                  ? setCurrentMenuItem({
                      ...currentMenuItem,
                      onlyToMembers: e.target.checked,
                    })
                  : setNewMenuItem({
                      ...newMenuItem,
                      onlyToMembers: e.target.checked,
                    })
              }
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton
            color="primary"
            onClick={() =>
              currentMenuItem
                ? handleUpdateMenuItem(currentMenuItem.menuItemId)
                : handleCreateMenuItem()
            }
          >
            {currentMenuItem ? "Save Changes" : "Create"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default MenuItems;
