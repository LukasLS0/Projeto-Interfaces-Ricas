import { form, min, minLength, pattern, required } from '@angular/forms/signals';
import type { WritableSignal } from '@angular/core';
import type { IpBloqueado } from './ip-bloqueado';

const IPV4_PATTERN =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export function createIpBloqForm(model: WritableSignal<IpBloqueado>) {
  return form(model, (schemaPath) => {
    required(schemaPath.ip, { message: 'IP é obrigatório.' });
    pattern(schemaPath.ip, IPV4_PATTERN, {
      message: 'IP deve ser um endereço IPv4 válido.',
    });
    required(schemaPath.tentativas, { message: 'Tentativas é obrigatório.' });
    min(schemaPath.tentativas, 1, { message: 'Tentativas deve ser maior que zero.' });
    required(schemaPath.origem, { message: 'Origem é obrigatório.' });
    minLength(schemaPath.origem, 3, { message: 'Origem deve ter pelo menos 3 caracteres.' });
  });
}
