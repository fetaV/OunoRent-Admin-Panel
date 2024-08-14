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
  createFooter,
  deleteFooter,
  fetchFooter,
  fetchFooterForID,
  updateFooter,
} from "src/api/useApi";

const Footer = () => {
  const [state, setState] = useState({
    footer: [],
    currentFooter: null,
    editFooterId: null,
    visible: false,
    searchQuery: "",
    filteredFooter: [],
    editFooterData: {},
    currentPage: 1,
    isActive: true,
  });
  const itemsPerPage = 10;

  useEffect(() => {
    const loadFooter = async () => {
      const [footer] = await Promise.all([fetchFooter()]);
      setState((prevState) => ({
        ...prevState,
        footer: footer,
        filteredFooter: footer,
      }));
    };
    loadFooter();
  }, []);

  const handleModalOpen = async (formId = null) => {
    if (formId) {
      const data = await fetchFooterForID(formId);
      setState((prevState) => ({
        ...prevState,
        editFooterData: {
          label: data.label || "",
          orderNumber: data.orderNumber || "",
          column: data.column || "",
          targetUrl: data.targetUrl || "",
          isActive: data.isActive || false,
        },
        editFooterId: formId,
        modalVisible: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        editFooterData: {
          label: "",
          orderNumber: "",
          column: "",
          targetUrl: "",
          isActive: false,
        },
        editFooterId: null,
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { editFooterId, isActive, label } = state;

    const footerData = {
      label,
      targetUrl: "",
      orderNumber: 0,
      column: "",
      isActive,
    };

    if (editFooterId) {
      await updateFooter(editFooterId, footerData);
      toast.success("Footer başarıyla güncellendi.");
    } else {
      await createFooter(footerData);
      toast.success("Footer başarıyla oluşturuldu.");
    }

    const updatedFooter = await fetchFooter();
    setState((prevState) => ({
      ...prevState,
      modalVisible: false,
      footer: updatedFooter,
      filteredFooter: updatedFooter,
    }));
  };

  const handleDelete = async (formId) => {
    await deleteFooter(formId);
    toast.success("Footer başarıyla silindi!");
    const updatedFooter = await fetchFooter();
    setState((prevState) => ({
      ...prevState,
      footer: updatedFooter,
      filteredFooter: updatedFooter,
    }));
  };

  useEffect(() => {
    const filterFooter = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.footer.filter((item) => {
        const label = item.label ? item.label.toLowerCase() : "";
        const targetUrl = item.targetUrl ? item.targetUrl.toLowerCase() : "";
        const column = item.column ? item.column.toString().toLowerCase() : "";
        const orderNumber = item.orderNumber
          ? item.orderNumber.toString().toLowerCase()
          : "";

        return [label, targetUrl, column, orderNumber].some((value) =>
          value.includes(lowercasedQuery)
        );
      });

      setState((prevState) => ({
        ...prevState,
        filteredFooter: filteredData,
      }));
    };

    filterFooter();
  }, [state.searchQuery, state.footer]);

  const handleEdit = async () => {
    const updatedData = state.editFooterData;
    await updateFooter(state.editFooterData.footerId, updatedData);
    toast.success("Adres başarıyla güncellendi.");
    setState((prevState) => ({
      ...prevState,
      footeres: prevState.footer.map((item) =>
        item.footerId === updatedData.footerId ? updatedData : item
      ),
      modalVisible: false,
    }));
  };

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredFooter.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleToggleActive = async (footerId, currentStatus) => {
    const updatedFooter = {
      ...state.footer.find((item) => item.footerId === footerId),
      isActive: !currentStatus,
    };

    await updateFooter(footerId, updatedFooter);

    toast.success("Footer durumu başarıyla güncellendi.");

    const updatedFooterList = await fetchFooter();

    setState((prevState) => ({
      ...prevState,
      footer: updatedFooterList,
      filteredFooter: updatedFooterList,
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
        Yeni Footer Ekle
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
            {[
              "Menü Başlığı",
              "Sıra Numarası",
              "Sütun",
              "Hedef URL",
              "Durum",
              "Eylemler",
            ].map((header) => (
              <CTableHeaderCell key={header}>{header}</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((item) => (
            <CTableRow
              style={{ textAlign: "center", verticalAlign: "middle" }}
              key={item.footerItemId}
            >
              {["label", "orderNumber", "column", "targetUrl"].map((key) => (
                <CTableDataCell key={key}>{item[key]}</CTableDataCell>
              ))}

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
                  onClick={() => handleToggleActive(item.footerItemId)}
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
                    handleModalOpen(item.footerItemId);
                  }}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDelete(item.footerItemId)}
                >
                  <CIcon icon={cilTrash} />
                </CButton>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>

      <CPagination>
        {Array.from(
          { length: Math.ceil(state.filteredFooter.length / itemsPerPage) },
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
            {state.editFooterId ? "Footer Düzenle" : "Yeni Footer Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            {[
              { label: "Footer Adı", value: "label" },
              { label: "Sıra Numarası", value: "orderNumber" },
              { label: "Sütun Numarası", value: "column" },
              { label: "Hedef URL", value: "targetUrl" },
            ].map(({ label, value, type = "text" }) => (
              <CFormInput
                key={value}
                className="mb-3"
                type={type}
                label={label}
                value={state.editFooterData[value] || ""}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    editFooterData: {
                      ...prevState.editFooterData,
                      [value]: e.target.value,
                    },
                  }))
                }
              />
            ))}
            {state.editFooterId === null && (
              <CFormSwitch
                id="isActive"
                label={state.isActive ? "Aktif" : "Pasif"}
                checked={state.isActive}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    isActive: e.target.checked,
                  }))
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
            {state.editFooterId ? "Güncelle" : "Kaydet"}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Footer;
