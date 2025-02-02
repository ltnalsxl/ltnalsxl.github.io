# frozen_string_literal: true

source "https://rubygems.org"

gem "github-pages", group: :jekyll_plugins
gem "jekyll-feed"
gem "jekyll-sitemap"

gemspec

gem "html-proofer", "~> 5.0", group: :test

# logger 추가
gem "logger"

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.2.0", :platforms => [:mingw, :x64_mingw, :mswin]
