import React, { useState, useEffect } from 'react';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faSearch, faEye } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import MUIDataTable from "mui-datatables";
import Select from 'react-select';
import Swal from 'sweetalert2';

const url = "http://localhost:4000/articulo/";
const options = {
    selectableRows: false,
    responsive: "standard",
    pagination: true,
    rowsPerPage: 5,
    textLabels: {
        body: {
            noMatch: "No se han encontrado resultados con los datos digitados",
            toolTip: "Ordenar",
        },
        toolbar: {
            search: "Buscar",
            downloadCsv: "Descargar CSV",
            print: "Imprimir",
            viewColumns: "Ver Columnas",
            filterTable: "Filtrar Tabla",
        },
        filter: {
            all: "Todos",
            title: "Filtros",
            reset: "Reiniciar",
        },
        viewColumns: {
            title: "Mostrar Columnas",
            titleAria: "Mostrar/Ocultar Columnas",
        },
        selectedRows: {
            text: "Fila(s) seleccionada",
            delete: "Eliminar",
            deleteAria: "Eliminar Columna Seleccionada",
        },
        pagination: {
            next: "Siguiente Página",
            previous: "Anterior Página",
            rowsPerPage: "Filas por página:",
            displayRows: "de"
        }
    },
    rowsPerPageOptions: [5, 10, 15]
};

export function Articulo() {
    const [articulos, setArticulo] = useState([]);
    const [trazabilidad, setTrazabildiad] = useState([]);
    const [categorias, setCategoria] = useState([]);
    const [modalInsertar, setModalInsertar] = useState(false);
    const [modalEliminar, setModalEliminar] = useState(false);
    const [modalTrazable, setModalTrazable] = useState(false);

    const [optionsArticulos, setOptionsArticulos] = useState([]);
    const [selectedArticulo, setSelectedArticulo] = useState(null);

    const [form, setForm] = useState({
        pIdArticulo: '',
        pNombre: '',
        pDescripcion: '',
        pIdCategoria: '',
        pPrecioCosto: '',
        pPrecioPromedio: '',
        pCantidadActual: ''
    });

    useEffect(() => {
        get();
        getCategoria();
    }, []);

    const get = async () => {
        try {
            const response = await axios.get("http://localhost:4000/articulo/getArticulo");
            setArticulo(response.data);

            const options = response.data.map(articulo => ({
                value: articulo.IdArticulo,
                label: articulo.Nombre
            }));
            setOptionsArticulos(options);
        } catch (error) {
            console.log(error.message);
        }
    };

    const getTrazabilidad = async () => {
        try {
            const response = await axios.get("http://localhost:4000/trazabiliad/getTrazabildiad/" + form.pIdArticulo, form);
            setTrazabildiad(response.data);
        } catch (error) {
            console.log(error.message);
        }
    };

    const validateForm = () => {
        if (!form.pNombre || !form.pDescripcion || !form.pIdCategoria || !form.pPrecioCosto || !form.pCantidadActual) {
            Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
            return false;
        }
        return true;
    };

    const getCategoria = async () => {
        try {
            const response = await axios.get("http://localhost:4000/categoria/getCategoria");
            const categoriasActivas = response.data.filter(categoria => categoria.Estado !== "Categoría Desactivada");
            setCategoria(categoriasActivas);
        } catch (error) {
            console.log(error.message);
        }
    };

    const peticionPost = async () => {
        if (!validateForm()) return;

        try {
            await axios.post(url + "agregarArticulo", form);
            toggleModalInsertar();
            get();
            Swal.fire('Articulo agregado', 'El articulo se ha agregado correctamente', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo agregar el articulo', 'error');
            console.log(error.message);
        }
    };

    const peticionPut = async () => {
        if (!validateForm()) return;

        try {
            await axios.put(url + "actualizarArticulo/" + form.pIdArticulo, form);
            toggleModalInsertar();
            get();
            Swal.fire('Articulo actualizado', 'El articulo se ha actualizado correctamente', 'success');
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar el articulo', 'error');
            console.log(error.message);
        }
    };

    const peticionDelete = async () => {
        try {
            const response = await axios.delete(url + "eliminarArticulo/" + form.pIdArticulo);
            const { message } = response.data;

            // Determinar el tipo de alerta basado en el mensaje
            if (message.includes('eliminado correctamente')) {
                Swal.fire('Artículo eliminado', message, 'success');
                setModalEliminar(false);
                get();
            } else {
                Swal.fire('Error', message, 'error');
            }
        } catch (error) {
            Swal.fire('Error', 'El artículo no se pudo eliminar.', 'error');
            console.log(error.message);
        }
    };

    const selectArticulo = (articulo) => {
        setForm({
            pIdArticulo: articulo.IdArticulo,
            pNombre: articulo.Nombre,
            pDescripcion: articulo.Descripcion,
            pIdCategoria: articulo.IdCategoria,
            pPrecioCosto: articulo.PrecioCosto,
            pPrecioPromedio: articulo.PrecioPromedio,
            pCantidadActual: articulo.CantidadActual,
            tipoModal: 'actualizar'
        });
    };

    const toggleModalInsertar = () => {
        setModalInsertar(!modalInsertar);
    };

    const toggleModalTrazable = () => {
        setModalTrazable(!modalTrazable);
    };

    const handleChange = async (e) => {
        e.persist();
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleDelete = (IdArticulo) => {
        setForm({ pIdArticulo: IdArticulo });
        setModalEliminar(true);
    };

    const handleUpdate = (articulo) => {
        selectArticulo(articulo);
        toggleModalInsertar();
    };

    const handleCategoriaChange = (e) => {
        const selectedCategoriaId = e.target.value;
        setForm({
            ...form,
            pIdCategoria: selectedCategoriaId
        });
    };

    const handleChangeArticulo = (selectedOption) => {
        setSelectedArticulo(selectedOption);
        setForm({
            ...form,
            pIdArticulo: selectedOption.value
        });
    };

    const trazabilidadColumns = [
        {
            name: "IdTrazabilidad",
            label: "Id Trazabildiad"
        },
        {
            name: "NombreArticulo",
            label: "Nombre Articulo"
        },
        {
            name: "FechaRegistro",
            label: "Fecha Registro"
        },
        {
            name: "Detalles",
            label: "Detalles"
        },
        {
            name: "DetalleTrazabilidadP",
            label: "Accion pasada"
        },
    ];

    const columns = [
        {
            name: "IdArticulo",
            label: "Id Articulo"
        },
        {
            name: "Nombre",
            label: "Nombre "
        },
        {
            name: "Descripcion",
            label: "Descripcion"
        },
        {
            name: "NombreCategoria",
            label: "Categoria"
        },
        {
            name: "PrecioCosto",
            label: "Precio costo"
        },
        {
            name: "PrecioPromedio",
            label: "Precio promedio"
        },
        {
            name: "CantidadActual",
            label: "Cantidad actual"
        },
        {
            name: "acciones",
            label: "Acciones",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) => {
                    const articulo = articulos[dataIndex];
                    return (
                        <>
                            <button className="btn-modal" onClick={() => handleDelete(articulo.IdArticulo)}>
                                <span><FontAwesomeIcon icon={faTrashAlt} /></span>
                            </button>

                            <button className="btn-modal" onClick={() => handleUpdate(articulo)}>
                                <span><FontAwesomeIcon icon={faEdit} /> </span>
                            </button>
                        </>
                    );
                }
            }
        }
    ];

    return (
        <>
            <div className="Articulo">
                <br />
                <div className="center-content">
                    <button className="btn" onClick={() => { setModalTrazable(true); }}>
                        <span><FontAwesomeIcon icon={faEye} /></span>
                    </button>
                    <button className="btn" onClick={() => { setForm(null); setForm({ tipoModal: 'insertar' }); setModalInsertar(true); }}>
                        <span><FontAwesomeIcon icon={faPlus} /></span>
                    </button>
                </div>
                <br /><br />
                <div className="table-container">
                    <MUIDataTable
                        title={"Articulos "}
                        data={articulos}
                        columns={columns}
                        options={options}
                    />
                </div>

                <Modal isOpen={modalInsertar}>
                    <ModalHeader style={{ display: 'block' }}>
                        <span style={{ float: 'right', cursor: 'pointer' }} onClick={() => toggleModalInsertar()}>x</span>
                        <h1>{form.tipoModal === 'insertar' ? 'Agregar Articulo' : 'Actualizar Articulo'}</h1>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group">
                            <input
                                className="custom-input"
                                placeholder='Nombre Articulo'
                                type="text"
                                name="pNombre"
                                id="pNombre"
                                onChange={handleChange}
                                value={form ? form.pNombre : ''}
                            />
                            <br />
                            <input
                                className="custom-input"
                                placeholder='Descripcion'
                                type="text"
                                name="pDescripcion"
                                id="pDescripcion"
                                onChange={handleChange}
                                value={form ? form.pDescripcion : ''}
                            />
                            <br />
                            <select
                                className="custom-input"
                                name="pIdCategoria"
                                id="pIdCategoria"
                                onChange={handleCategoriaChange}
                                value={form ? form.pIdCategoria : ''}
                            >
                                <option value="">Seleccionar Categoria</option>
                                {categorias.map(categoria => (
                                    <option key={categoria.IdCategoria} value={categoria.IdCategoria}>{categoria.NombreCategoria}</option>
                                ))}
                            </select>
                            <br />
                            <input
                                className="custom-input"
                                placeholder='Precio costo '
                                type="text"
                                name="pPrecioCosto"
                                id="pPrecioCosto"
                                onChange={handleChange}
                                value={form ? form.pPrecioCosto : ''}
                                onKeyPress={event => {

                                    const allowedChars = /[0-9\b]/;
                                    if (!allowedChars.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }} />
                            <br />
                            <input
                                className="custom-input"
                                placeholder='Cantidad actual'
                                type="text"
                                name="pCantidadActual"
                                id="pCantidadActual"
                                onChange={handleChange}
                                value={form ? form.pCantidadActual : ''}
                                onKeyPress={event => {
                                    const allowedChars = /[0-9\b]/;
                                    if (!allowedChars.test(event.key)) {
                                        event.preventDefault();
                                    }
                                }}
                            />
                            <br />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        {form.tipoModal === 'insertar' ?
                            <button className="btn-modal " onClick={() => peticionPost()}>
                                <span>Insertar</span>
                            </button> :
                            <button className="btn-modal " onClick={() => peticionPut()}>
                                <span>Actualizar</span>
                            </button>
                        }
                        <button className="btn-modal" onClick={() => setModalInsertar(false)}><span>Cancelar</span></button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalEliminar}>
                    <ModalBody>
                        Estás seguro que deseas eliminar este Articulo {form && form.pNombre}
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn-modal" onClick={() => { peticionDelete(); }}>
                            <span>Sí</span>
                        </button>
                        <button className="btn-modal" onClick={() => setModalEliminar(false)}>
                            <span>No</span>
                        </button>
                    </ModalFooter>
                </Modal>

                <Modal isOpen={modalTrazable} size="xl">
                    <ModalHeader style={{ display: 'block' }}>
                        <span style={{ float: 'right', cursor: 'pointer' }} onClick={() => toggleModalTrazable()}>x</span>
                        <h1>Trazabilidad de artículo</h1>
                    </ModalHeader>
                    <ModalBody>
                        <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <Select
                                className="custom-input"
                                classNamePrefix="custom-select"
                                value={selectedArticulo}
                                onChange={handleChangeArticulo}
                                options={optionsArticulos}
                                placeholder="Seleccionar Artículo"
                                style={{ width: '70%', marginRight: '10px' }}
                            />
                            <button className="btn-modal" onClick={() => getTrazabilidad()}>
                                <span><FontAwesomeIcon icon={faSearch} /></span>
                            </button>
                        </div>
                        {trazabilidad.length > 0 && (
                            <div className="table-container" style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
                                <MUIDataTable
                                    title={"Trazabilidad del Artículo"}
                                    data={trazabilidad}
                                    columns={trazabilidadColumns}
                                    options={options}
                                />
                            </div>
                        )}
                    </ModalBody>
                </Modal>
            </div>
        </>
    );
}

export default Articulo;