<template>
  <div class="container">
    <v-app>
      <div>
        <v-timeline dense>
          <v-timeline-item
            v-for="post in posts"
            :key="post.id"
            small
            color="teal lighten-3"
          >
            <v-card>
              <v-card-text>
                <div class="text--primary mb-2" v-text="post.content" />

                <div v-text="post.createdAt" />
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </div>
    </v-app>
  </div>
</template>

<script lang="ts">
import listQuery from "../queries/list.gql";

export default {
  apollo: {
    posts: {
      prefetch: true,
      query: listQuery,
    },
  },
};
</script>
