var postsData = require("../../../data/post-data.js");
var app = getApp();
Page({

  data: {

  },

  onLoad: function (option) {
    var globalData = app.globalData;
    var postId = option.id;
    this.setData({
      currentPostId: postId
    });
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData
    });
    var postCollected = wx.getStorageSync('posts_collected');
    if (postCollected) {
      var postCollected = postCollected[postId];
      this.setData({
        collected: postCollected
      });
    } else {
      var postCollected = {};
      postCollected[postId] = false;
      wx.setStorageSync('posts_collected', postCollected);
    }

    if (globalData.g_isPlayingMusic && app.globalData.g_currentmusicPostId == postId) {
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setMusicMonitor();
  },

  setMusicMonitor: function () {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      // callback
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentmusicPostId = that.data.currentPostId;
    });
    wx.onBackgroundAudioPause(function () {
      // callback
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentmusicPostId = null;

    });
    wx.onBackgroundAudioStop(function () {
      // callback
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentmusicPostId = null;

    });
  },


  onCollectionTap: function (event) {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    this.showToast(postsCollected, postCollected);
  },

  showModal: function (postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: "收藏",
      content: postCollected ? "收藏文章?" : "取消收藏？",
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#5ec3b1",
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('posts_collected', postsCollected);
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },

  showToast: function (postsCollected, postCollected) {
    wx.setStorageSync('posts_collected', postsCollected);
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消收藏",
      icon: "success",
      duration: 1000
    })
  },

  onShareTap: function (event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#5ec3b1",
      success: function (res) {
        if (!res.cancel) {
          wx.showModal({
            title: "用户" + itemList[res.tapIndex],
            content: "暂时不支持" + itemList[res.tapIndex] + "功能，期待微信小程序越做越好！"
          })

        }

      }
    })
  },

  onMusicTap: function (event) {
    var currentPostId = this.data.currentPostId;
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      });
    } else {
      wx.playBackgroundAudio({
        dataUrl: postsData.postList[currentPostId].music.url,
        title: postsData.postList[currentPostId].music.title,
        coverImgUrl: postsData.postList[currentPostId].music.coverImg,
      })
      this.setData({
        isPlayingMusic: true
      });
    }



  }


})