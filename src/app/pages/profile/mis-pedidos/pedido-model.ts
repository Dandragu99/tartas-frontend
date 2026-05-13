interface PedidoDTO {
  idPedido: number;
  productoBaseNombre: string;
  ingredientes: string[];
  estado: 'PENDIENTE' | 'EN_PROCESO' | 'ENVIADO' | 'ENTREGADO';
  precioTotal: number;
  fechaEntrega: string;
}
