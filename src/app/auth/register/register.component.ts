import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ]
})

export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator }); // Validador customizado
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.registerForm.valid) {
      const { username, email, password } = this.registerForm.value;

      this.authService.register(username, email, password).subscribe({
        next: (response) => {
          console.log('Registro bem-sucedido!', response);
          this.successMessage = 'Conta criada com sucesso! Você pode fazer login agora.';
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Erro no registro:', err);
          if (err.status === 409) {
            this.errorMessage = 'Usuário ou e-mail já estão em uso.';
          } else {
            this.errorMessage = 'Ocorreu um erro ao registrar. Tente novamente.';
          }
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Por favor, corrija os erros do formulário.';
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}