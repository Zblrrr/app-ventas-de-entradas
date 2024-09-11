import { Component } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  cliente = {
    nombre: '',
    apellido: '',
    edad: null as number | null
  };

  eventoSeleccionado: string = '';
  entradas: any[] = [];
  total: number = 0; 
  totalSinDescuento: number = 0; 
  descuentoAplicado: string = ''; 

  tiposDeEntradas: { [key: string]: { nombre: string; precio: number; cantidad: number }[] } = {
    cine: [
      { nombre: 'General', precio: 9000, cantidad: 0 },
      { nombre: 'VIP', precio: 18000, cantidad: 0 }
    ],
    deportes: [
      { nombre: 'General', precio: 15000, cantidad: 0 },
      { nombre: 'VIP', precio: 25000, cantidad: 0 },
      { nombre: 'Palco', precio: 37000, cantidad: 0 }
    ],
    conciertos: [
      { nombre: 'General', precio: 15000, cantidad: 0 },
      { nombre: 'VIP', precio: 28000, cantidad: 0 }
    ]
  };

  constructor(
    public alertController: AlertController,
    public toastController: ToastController
  ) {}

  mostrarEntradas() {
    if (this.eventoSeleccionado) {
      this.entradas = this.tiposDeEntradas[this.eventoSeleccionado] || [];
      this.calcularTotal(); 
    } else {
      this.entradas = [];
      this.total = 0; 
      this.totalSinDescuento = 0; 
    }
  }

  calcularTotal() {
    this.totalSinDescuento = this.entradas.reduce((sum, entrada) => {
      return sum + (entrada.precio * (entrada.cantidad || 0));
    }, 0);

    if (this.cliente.edad != null) {
      if (this.cliente.edad < 18) {
        this.total = this.totalSinDescuento * 0.9; 
        this.descuentoAplicado = 'Descuento por ser menor de edad.';
      } else if (this.cliente.edad > 60) {
        this.total = this.totalSinDescuento * 0.8; 
        this.descuentoAplicado = 'Descuento por ser de la tercera edad.';
      } else {
        this.total = this.totalSinDescuento; 
        this.descuentoAplicado = 'Sin descuento aplicado.';
      }
    } else {
      this.total = this.totalSinDescuento; 
      this.descuentoAplicado = 'Sin descuento aplicado.';
    }
  }

  formatCurrency(value: number): string {
    return Math.round(value).toString(); // Redondear y convertir a cadena (chatgpt, no se entiende bien)
  }

  async finalizarCompra() {
    this.calcularTotal();

    const mensaje = `
      Gracias por tu compra, ${this.cliente.nombre}.
      Total: ${this.formatCurrency(this.total)} CLP
      Total sin descuento: ${this.formatCurrency(this.totalSinDescuento)} CLP
      Total con descuento: ${this.formatCurrency(this.total)} CLP
      ${this.descuentoAplicado}`;

    const alert = await this.alertController.create({
      header: 'Compra Finalizada',
      message: mensaje,
      buttons: ['OK']
    });

    await alert.present();

    alert.onDidDismiss().then(async () => {
      const toast = await this.toastController.create({
        message: 'Compra finalizada',
        duration: 3000, 
        color: 'success', 
        position: 'bottom', 
        cssClass: 'my-toast'
      });

      await toast.present();
    });
  }
}
