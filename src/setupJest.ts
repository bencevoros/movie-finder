import 'zone.js';
import 'zone.js/testing';
import 'zone.js/dist/async-test.js';
import { TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import 'jest-preset-angular';

TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());