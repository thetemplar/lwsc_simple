import { Component, OnInit } from '@angular/core';
import { UDP }  from '@frontall/capacitor-udp';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  ipAddress = 'asd';

  constructor(private toastCtrl: ToastController) {}

  ngOnInit() {
    this.findGateway();
  }

  async findGateway() {
    UDP.create().then((info) => {;
        const socketId = info.socketId;
        this.openToast(`Willkommen!`);
        UDP.bind({socketId: info.socketId, address: '0.0.0.0', port: 5556});
        UDP.addListener('receive', data => {

          const str = atob(data.buffer);
          const buf = new ArrayBuffer(str.length);
          const bufView = new Uint8Array(buf);
          for (let i = 0, strLen = str.length; i < strLen; i++) {
              bufView[i] = str.charCodeAt(i);
          }

          const msg = new TextDecoder().decode(buf);

          if (msg.startsWith('WIFIBRIDGE'))
          {
            const parts = msg.split(' ');
            this.ipAddress = parts[1];
            this.openToast('found gateway: ' + parts[1]);

            UDP.closeAllSockets();
          }
        });
    });
  }

  async openToast(txt) {
    const toast = await this.toastCtrl.create({
      message: txt,
      duration: 2000
    });
    toast.present();
  }
}
