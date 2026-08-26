/**
 * SHADOW / DESIGN REVIEW — Admin Panel entry point
 * Mounted at /admin behind PHP-session authentication.
 *
 * Author: Hamidreza Derhami
 * SPDX-License-Identifier: Apache-2.0
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AdminApp } from './AdminApp';
import '../index.css';

// Hamidreza Derhami

createRoot(document.getElementById('admin-root')!).render(
  <StrictMode>
    <AdminApp />
  </StrictMode>
);
