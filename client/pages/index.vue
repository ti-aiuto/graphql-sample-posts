<template>
  <div class="container">
    <v-app>
      <v-dialog v-model="dialog" max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">
            新規投稿
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">新規投稿</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    label="本文を入力..."
                    required
                    v-model="editingContent"
                  />
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
import Vue from "vue";
import listPostsGql from "../queries/list.gql";
import publishPostGql from "../queries/publish-post.gql";

export default Vue.extend({
  data() {
    return { dialog: false, editingContent: null };
  },
  methods: {
    openPostFormDialog() {
      this.dialog = true;
      this.editingContent = null;
    },
    async submitPostForm() {
      const { error } = await this.$apollo.mutate({
        mutation: publishPostGql,
        variables: {
          content: "hogehoge",
        },
        refetchQueries: [
          {
            query: listPostsGql,
          },
        ],
      });

      if (error) {
        console.error(error);
      }

      this.dialog = false;
    },
  },
  apollo: {
    posts: {
      prefetch: true,
      query: listPostsGql,
    },
  },
});
</script>
