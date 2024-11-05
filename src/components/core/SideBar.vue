<template>
    <v-navigation-drawer v-model="drawer" :rail="$vuetify.display.mobile ? true : false" permanent @click="rail = false">
        <v-card>
            <v-card-item>
                <v-img :src="appLogo" :width="120" contain />
            </v-card-item>
        </v-card>
        <v-list :items="items">

        </v-list>
    </v-navigation-drawer>
</template>
<script>
    import {
        reactive,
        toRef
    } from 'vue';
    import appLogo from '@/assets/img/logo.jpeg'

    export default {
        props: {
            drawer: {
                type: Boolean,
                default: true
            }
        },
        setup(props) {
            const drawer = toRef(props, 'drawer')
            const items = reactive([{
                    title: 'Dashboard',
                    value: 'foo',
                },
                {
                    title: 'Administration',
                    value: 'Content Update',
                },
                {
                    title: 'FiToday Guessingzz',
                    value: 'fizz',
                },
                {
                    title: 'Number Update',
                    value: 'buzz',
                },
                {
                    title: 'Home',
                    value: 'buzz',
                },
            ])

            return {
                drawer,
                items,
                appLogo
            }
        }
    }
</script>
