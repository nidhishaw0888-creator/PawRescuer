import { test } from 'node:test'
import assert from 'node:assert/strict'
import { suggestPriority } from '../src/services/priorityService.js'

test('critical severity is Critical priority', () => {
  assert.equal(suggestPriority('Critical', 'Other').priority, 'Critical')
})

test('life-threatening emergency types are Critical at normal severity', () => {
  assert.equal(suggestPriority('Normal', 'Trapped').priority, 'Critical')
})

test('normal severity with a non-urgent type is Normal priority', () => {
  assert.equal(suggestPriority('Normal', 'Other').priority, 'Normal')
})
