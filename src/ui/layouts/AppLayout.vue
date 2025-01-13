<script setup>
import {QLayout, QHeader, QToolbar, QToolbarTitle, QAvatar, QTabs, QRouteTab, QPageContainer, QSpace, QBtn} from "quasar";
import router from "../router";

const onLogout = async () => {
  await window.api.invoke('store-delete-all')
}
</script>

<template>
  <q-layout view="hHh lpR fFf">

    <q-header reveal elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          StashBox
        </q-toolbar-title>
        <q-space />
        <q-btn flat round dense icon="logout" @click="onLogout" />
      </q-toolbar>

      <q-tabs align="left">
        <section v-for="(routeItem, index) in router.getRoutes()">
          <q-route-tab
              :key="index"
              :to="routeItem.path"
              :label="routeItem.meta.label"
              v-if="routeItem.meta && routeItem.meta.on_tabs"
          />
        </section>
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<style scoped>

</style>