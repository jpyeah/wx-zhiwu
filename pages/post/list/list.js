var postsData = require("../../../data/post-data.js")

Page({
  data: {
  },
  onLoad: function () {
    // this.setData({
    //   posts_key:postsData.postList
    //   });
    this.setData({
      postList: postsData.postList
    });
    console.log(this.data.postList);
  },

  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    // console.log(postId);
    wx.navigateTo({
      url: "post/detail?id=" + postId
    })
  },

  onSwiperTap: function (event) {
    var postId = event.target.dataset.postid;;
    wx.navigateTo({
      url: 'post/detail?id=' + postId
    })
  }


})
