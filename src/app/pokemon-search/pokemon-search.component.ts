import { ChangeDetectionStrategy, Component, computed, effect, OnDestroy, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { PokemonService } from '../services/pokemon.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-pokemon-search',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    InputTextModule,
    InputGroupModule,
    ToastModule,
    ButtonModule,
    RippleModule,
  ],
  providers: [
    PokemonService,
    MessageService, // Aseguramos que MessageService esté disponible
  ],
  templateUrl: './pokemon-search.component.html',
  styleUrls: ['./pokemon-search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonSearchComponent implements OnDestroy {
  pokemonNameOrId = signal('');
  loading = signal(false);
  pokemonData = signal<any>(null);
  animationArray = signal<string[]>([]);
  indiceActual = signal(0);
  animating = signal(false);

  imagenActual = computed(() => {
    const array = this.animationArray();
    return array.length > 0 ? array[this.indiceActual()] : '';
  });

  constructor(
    private pokemonService: PokemonService,
    private messageService: MessageService
  ) {
    effect(() => {
      if (this.animating()) {
        this.animateFrames();
      }
    });
  }

  ngOnDestroy(): void {
    this.detenerAnimacion();
  }

  playSound(soundSource: string) {
    const audio = new Audio();
    audio.src = soundSource;
    audio.load();
    audio.play();
  }

  loadPokemon() {
    if (this.pokemonNameOrId().length > 0) {
      this.detenerAnimacion();
      this.loading.set(true);
      this.pokemonService.getPokemon(this.pokemonNameOrId()).subscribe({
        next: (pokemon: any) => {
          this.pokemonData.set(pokemon);
          this.loading.set(false);
          this.animationArray.set([
            pokemon.sprites.front_default,
            pokemon.sprites.back_default,
          ]);
          this.iniciarAnimacion();
          this.playSound(this.pokemonData().cries?.latest || '');
        },
        error: () => {
          this.openSnackBarError();
          this.loading.set(false);
        },
      });
    } else {
      this.openSnackSinData();
    }
  }

  openSnackBarError() {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Nombre o id de Pokémon no válido',
    });
  }

  openSnackSinData() {
    this.messageService.add({
      severity: 'warn',
      summary: 'Alerta',
      detail: 'Escriba un nombre o id para cargar',
    });
  }

  iniciarAnimacion() {
    this.indiceActual.set(0);
    this.animating.set(true);
  }

  animateFrames() {
    setTimeout(() => {
      if (this.animating()) {
        this.indiceActual.update(
          (index) => (index + 1) % this.animationArray().length
        );
        this.animateFrames();
      }
    }, 450);
  }

  detenerAnimacion() {
    this.animating.set(false);
  }

  updateName(name: string) {
    this.pokemonNameOrId.set(name.toLocaleLowerCase());
  }
}
