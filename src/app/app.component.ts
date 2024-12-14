import { Component,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from './services/paciente.service';
import { EspecialidadService } from './services/especialidad.service';
import { Patient } from './model/patient.interface'; 
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'solicitud-cita';

  citaForm: FormGroup;
  especialidades: any[] = [];
  
  mensajeError: string = '';

  //modelo patient
 //inicializo el modelo Patient

 paciente: Patient = {
  name: '',
  paternalSurname: '',
  maternalSurname: '',
  dni: '',
  dateBirth: '',
  gender: '',
  address: '',
  email: '',
  phone: '',
  familyHistory: '',
  allergies: '',
  job: '',
  createdAt: '',
  updatedAt: '',
  _id: ''
};


  constructor(
    private fb: FormBuilder,
    private pacienteService: PatientService,
    private especialidadService: EspecialidadService
  ) {
    this.citaForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}$/)]],
      nombre: [{ value: '', disabled: true }],
      apellidoPaterno: [{ value: '', disabled: true }],
      apellidoMaterno: [{ value: '', disabled: true }],
      especialidad: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarEspecialidades();
  }

  cargarEspecialidades(): void {
    this.especialidadService.getEspecialidades().subscribe({
      next: (data: any) => {
        this.especialidades = data;
      },
      error: (err) => {
        console.error('Error al cargar especialidades:', err);
      },
      complete: () => {
        console.log('Carga de especialidades completada');
      }
    });
  }


  guardarCita(): void {
    if (this.citaForm.invalid) {
      return;
    }

    const citaData = {
      idPaciente: this.paciente?._id,
      idEspecialidad: this.citaForm.get('especialidad')?.value
    };

    // Aquí deberías llamar a un servicio para guardar la cita
    console.log('Datos de la cita a guardar:', citaData);
    // Lógica de guardado (agregar implementación de servicio según tu backend)
  }

  onCancel(): void {
    this.citaForm.reset();
  
    this.mensajeError = '';
  }

  buscarPaciente(): void {
    const dni = this.citaForm.get('dni')?.value;
    console.log('Buscando paciente con DNI:', dni);
  
    if (!dni || dni.trim() === '') {
      this.mensajeError = 'Por favor, ingrese un DNI válido.';
  
      return;
    }
  
    this.pacienteService.getPatientByDni(dni).subscribe({
      next: (patients) => {
          if (patients.length > 0) {
              this.paciente = patients[0]; // Toma el primer paciente del array
              console.log('Primer paciente encontrado:', this.paciente);
          } else {
              console.log('No se encontraron pacientes con el DNI proporcionado');
          }
      },
      error: (error) => {
          console.error('Error al buscar paciente:', error);
      },
      complete: () => {
          console.log('Búsqueda completada');
      },
  });
}
}
