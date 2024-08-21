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
  CRow,
  CCol,
  CPagination,
  CPaginationItem,
  CFormSelect,
  CFormSwitch,
} from "@coreui/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createBlog,
  fetchBlog,
  fetchBlogForID,
  deleteBlog,
  updateBlog,
  fetchCategory,
  fetchSubCategoryForID,
} from "src/api/useApi";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./ckeditor-styles.css";

function Blog() {
  const [state, setState] = useState({
    blog: [],
    categories: [],
    subCategories: [],
    modalVisible: false,
    searchQuery: "",
    categoryData: {},
    deleteModalVisible: null,
    filteredBlog: [],
    currentPage: 1,
  });

  const itemsPerPage = 10;

  const loadBlog = async () => {
    const [blog, categories] = await Promise.all([
      fetchBlog(),
      fetchCategory(),
    ]);
    setState((prevState) => ({
      ...prevState,
      categories,
      blog: blog,
      filteredBlog: blog,
      modalVisible: false,
    }));
  };
  useEffect(() => {
    loadBlog();
  }, []);

  useEffect(() => {
    if (state.blogData?.categoryId) {
      fetchSubCategoryForID(state.blogData?.categoryId).then((data) => {
        setState((prevState) => ({
          ...prevState,
          subCategories: data,
        }));
      });
    }
  }, [state.blogData?.categoryId]);

  const handleModalOpen = async (blogId = null) => {
    if (blogId) {
      const data = await fetchBlogForID(blogId);
      setState((prevState) => ({
        ...prevState,
        blogData: data,
        blogId,
        modalVisible: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        blogData: {
          blogId: null,
          title: "",
          body: "",
          largeImage: null,
          smallImage: null,
          largeImageUrl: null,
          smallImageUrl: null,
          tags: "",
          slug: "",
          orderNumber: "",
          isActive: false,
          categoryId: "",
          subCategoryId: "",
        },
        blogId: null,
        modalVisible: true,
      }));
    }
  };

  const handleSave = async () => {
    const { blogId, blogData } = state;

    if (blogId) {
      setState((prevState) => ({
        ...prevState,
        blogData: {
          ...blogData,
          smallImageUrl: undefined,
          largeImageUrl: undefined,
        },
      }));

      await updateBlog(blogId, blogData);
      toast.success("Blog başarıyla güncellendi.");
    } else {
      console.log("111111");
      await createBlog(blogData);
      toast.success("Blog başarıyla oluşturuldu.");
    }

    loadBlog();
  };

  const handleFileChange = (e) => {
    const id = e.target.id;
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (id === "small") {
          setState((prevState) => ({
            ...prevState,
            blogData: {
              ...prevState.blogData,
              smallImage: reader.result,
            },
          }));
        } else if (id === "large") {
          setState((prevState) => ({
            ...prevState,
            blogData: {
              ...prevState.blogData,
              largeImage: reader.result,
            },
          }));
        }
      };

      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const filterBlog = () => {
      const lowercasedQuery = state.searchQuery.toLowerCase();
      const filteredData = state.blog.filter((item) => {
        const title = item.title ? item.title.toLowerCase() : "";

        return [title].some((value) => value.includes(lowercasedQuery));
      });

      setState((prevState) => ({
        ...prevState,
        filteredBlog: filteredData,
      }));
    };

    filterBlog();
  }, [state.searchQuery]);

  const indexOfLastItem = state.currentPage * itemsPerPage;
  const currentItems = state.filteredBlog.slice(
    indexOfLastItem - itemsPerPage,
    indexOfLastItem
  );

  const handleToggleActive = async (blogId, currentStatus) => {
    const updatedBlog = {
      ...state.blog.find((item) => item.blogId === blogId),
      isActive: !currentStatus,
    };
    console.log(updatedBlog);

    await updateBlog(blogId, updatedBlog);

    toast.success("Blog durumu başarıyla güncellendi.");

    const updatedBlogList = await fetchBlog();

    setState((prevState) => ({
      ...prevState,
      blog: updatedBlogList,
      filteredBlog: updatedBlogList,
    }));
  };

  const handleDeleteClick = (blogId) => {
    setState((prevState) => ({
      ...prevState,
      deleteBlogId: blogId,
      deleteModalVisible: true,
    }));
  };

  const confirmDelete = async () => {
    await deleteBlog(state.deleteBlogId);
    toast.success("Blog başarıyla silindi!");
    const updatedBlog = await fetchBlog();
    setState((prevState) => ({
      ...prevState,
      blog: updatedBlog,
      filteredBlog: updatedBlog,
      deleteModalVisible: false,
      deleteBlogId: null,
    }));
  };

  return (
    <>
      <ToastContainer />
      <CButton
        color="primary"
        className="mb-3"
        onClick={() => handleModalOpen()}
      >
        Yeni Blog Ekle
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

      <CModal
        visible={state.modalVisible}
        onClose={() =>
          setState((prevState) => ({ ...prevState, modalVisible: false }))
        }
        aria-labelledby="ModalLabel"
      >
        <CModalHeader>
          <CModalTitle id="ModalLabel">
            {state.blogData?.blogId ? "Blog Düzenle" : "Yeni Blog Ekle"}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              {[
                { label: "Başlık", value: "title", md: 6 },
                { label: "Sıra Numarası", value: "orderNumber", md: 6 },
              ].map(({ label, value, md }) => (
                <CCol key={value} md={md}>
                  <CFormInput
                    className="mb-3"
                    label={label}
                    value={state.blogData?.[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        blogData: {
                          ...prevState.blogData,
                          [value]: e.target.value,
                        },
                      }))
                    }
                  />
                </CCol>
              ))}
            </CRow>
            <CRow className="mb-3">
              {[
                { label: "Etiketler", value: "tags", md: 6 },
                { label: "Slug", value: "slug", md: 6 },
              ].map(({ label, value, md, type = "text" }) => (
                <CCol key={value} md={md}>
                  <CFormInput
                    key={value}
                    className="mb-3"
                    type={type}
                    label={label}
                    value={state.blogData?.[value] || ""}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        blogData: {
                          ...prevState.blogData,
                          [value]: e.target.value,
                        },
                      }))
                    }
                  />
                </CCol>
              ))}
            </CRow>

            {(state.blogData?.largeImage || state.blogData?.largeImageUrl) && (
              <div className="mb-3">
                <label>Mevcut large Image</label>
                <img
                  src={
                    state.blogData?.largeImage?.startsWith("data:image")
                      ? state.blogData?.largeImage
                      : `http://10.10.3.181:5244/${state.blogData?.largeImageUrl}`
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
              id="large"
            />
            {(state.blogData?.smallImage || state.blogData?.smallImageUrl) && (
              <div className="mb-3">
                <label>Mevcut small Image</label>
                <img
                  src={
                    state.blogData?.smallImage?.startsWith("data:image")
                      ? state.blogData?.smallImage
                      : `http://10.10.3.181:5244/${state.blogData?.smallImageUrl}`
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
              id="small"
            />
            <CRow>
              <CCol>
                <CFormSelect
                  label="Kategori"
                  className="mb-3"
                  aria-label="Select category"
                  onChange={(e) => {
                    setState((prevState) => ({
                      ...prevState,
                      blogData: {
                        ...prevState.blogData,
                        categoryId: e.target.value,
                        subCategoryId: "",
                      },
                    }));
                  }}
                  value={state.blogData?.categoryId}
                >
                  <option value="">Kategori Seçiniz</option>
                  {state.categories.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol>
                <CFormSelect
                  label="Alt Kategori"
                  className="mb-3"
                  aria-label="Select subcategory"
                  onChange={(e) => {
                    setState((prevState) => ({
                      ...prevState,
                      blogData: {
                        ...prevState.blogData,
                        subCategoryId: e.target.value,
                      },
                    }));
                  }}
                  value={state.blogData?.subCategoryId}
                  disabled={!state.blogData?.categoryId}
                >
                  <option value="">Alt Kategori Seçiniz</option>
                  {state.subCategories.map((subCategory) => (
                    <option
                      key={subCategory.subCategoryId}
                      value={subCategory.subCategoryId}
                    >
                      {subCategory.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <div className="mb-3">
              <label htmlFor="body" className="form-label">
                Metin
              </label>
              <CKEditor
                editor={ClassicEditor}
                data={state.blogData?.body}
                onChange={(event, editor) =>
                  setState(() => ({
                    ...state,
                    blogData: {
                      ...state.blogData,
                      body: editor.getData(),
                    },
                  }))
                }
              />
            </div>
            {state.blogData?.blogId === null && (
              <CFormSwitch
                label="Aktif"
                id="isActive"
                className="mb-3"
                checked={state.blogData?.isActive}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    blogData: {
                      ...prevState.blogData,
                      isActive: e.target.checked,
                    },
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
            {state.blogData?.blogId ? "Güncelle" : "Kaydet"}
          </CButton>
        </CModalFooter>
      </CModal>
      <CTable hover>
        <CTableHead>
          <CTableRow>
            {[
              { label: "Başlık", value: "title" },
              { label: "Sıra Numarası", value: "orderNumber" },
              { label: "Büyük Resim", value: "largeImageUrl", isImage: true },
              { label: "Küçük Resim", value: "smallImageUrl", isImage: true },
              { label: "Etiketler", value: "tags" },
              { label: "Slug", value: "slug" },
              { label: "Alt Kategori", value: "subCategoryName" },
              { label: "Eylemler", value: "actions" },
            ].map(({ label, value, isImage, isStatus }) => (
              <CTableHeaderCell
                key={value}
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                {label}
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {currentItems.map((blog) => (
            <CTableRow key={blog.blogId}>
              {[
                { value: "title", isImage: false, isStatus: false },
                { value: "orderNumber", isImage: false, isStatus: false },
                { value: "largeImageUrl", isImage: true, isStatus: false },
                { value: "smallImageUrl", isImage: true, isStatus: false },
                { value: "tags", isImage: false, isStatus: false },
                { value: "slug", isImage: false, isStatus: false },
                { value: "subCategoryName", isImage: false, isStatus: false },
              ].map(({ value, isImage, isStatus }) => (
                <CTableDataCell
                  key={value}
                  style={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  {isImage ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={`http://10.10.3.181:5244/${blog[value]}`}
                        style={{
                          width: isImage ? "100px" : "50px",
                          height: "auto",
                        }}
                      />
                    </div>
                  ) : (
                    blog[value]
                  )}
                </CTableDataCell>
              ))}
              <CTableDataCell
                style={{ textAlign: "center", verticalAlign: "middle" }}
              >
                <CButton
                  className="me-2"
                  style={{
                    display: "inline-block",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    backgroundColor: blog.isActive ? "#d4edda" : "#f8d7da",
                    color: blog.isActive ? "#155724" : "#721c24",
                    border: `1px solid ${blog.isActive ? "#c3e6cb" : "#f5c6cb"}`,
                    cursor: "pointer",
                  }}
                  onClick={() => handleToggleActive(blog.blogId, blog.isActive)}
                >
                  {blog.isActive ? (
                    <CIcon icon={cilCheckCircle} />
                  ) : (
                    <CIcon icon={cilXCircle} />
                  )}
                </CButton>
                <CButton
                  color="primary text-white"
                  className="me-2"
                  onClick={() => {
                    handleModalOpen(blog.blogId);
                  }}
                >
                  <CIcon icon={cilPencil} />
                </CButton>
                <CButton
                  color="danger text-white"
                  onClick={() => handleDeleteClick(blog.blogId)}
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
          { length: Math.ceil(state.filteredBlog.length / itemsPerPage) },
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
        alignment="center"
        visible={state.deleteModalVisible}
        onClose={() =>
          setState((prevState) => ({
            ...prevState,
            deleteModalVisible: false,
            deleteBlogId: null,
          }))
        }
      >
        <CModalHeader>
          <CModalTitle>Bu Blogu silmek istediğinize emin misiniz?</CModalTitle>
        </CModalHeader>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                deleteModalVisible: false,
                deleteBlogId: null,
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
    </>
  );
}

export default Blog;
